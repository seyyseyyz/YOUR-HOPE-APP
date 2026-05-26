import pool from '../config/db.js';

/* ── CONSTANTS ─────────────────────────────────────────────────────
   Mirrors the DASS-21 scoring logic from the frontend data.js
──────────────────────────────────────────────────────────────────── */
const VALID_LEVELS = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];
const LEVEL_ORDER  = { Normal: 0, Mild: 1, Moderate: 2, Severe: 3, 'Extremely Severe': 4 };

const worstLevel = (...levels) =>
    levels.reduce((worst, l) =>
        LEVEL_ORDER[l] > LEVEL_ORDER[worst] ? l : worst
    , 'Normal');

/* ── SAVE RESULT ───────────────────────────────────────────────────
   POST /api/results
   Headers: Authorization: Bearer <token>
   Body: {
     depression_score, anxiety_score, stress_score,
     depression_level, anxiety_level, stress_level,
     test_language,
     answers: [{ question_id, category, answer_value }, …]  // 21 items
   }

   Changes vs original:
   • Full input validation before any DB call
   • worst_level computed server-side (not trusted from client)
   • Answers inserted in ONE batched query instead of 21 round-trips
   • Whole operation wrapped in a transaction — either all saves or none
   • Consistent error response shape
──────────────────────────────────────────────────────────────────── */
export const saveResult = async (req, res) => {
    const conn = await pool.getConnection();    // get dedicated connection for transaction

    try {
        const user_id = req.user.user_id;

        const {
            depression_score,
            anxiety_score,
            stress_score,
            depression_level,
            anxiety_level,
            stress_level,
            test_language = 'eng',
            answers,
        } = req.body;

        // ── Validate scores ──────────────────────────────────────────
        for (const [field, val] of Object.entries({
            depression_score, anxiety_score, stress_score
        })) {
            if (!Number.isInteger(val) || val < 0 || val > 42) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be an integer between 0 and 42`
                });
            }
        }

        // ── Validate levels ──────────────────────────────────────────
        for (const [field, val] of Object.entries({
            depression_level, anxiety_level, stress_level
        })) {
            if (!VALID_LEVELS.includes(val)) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be one of: ${VALID_LEVELS.join(', ')}`
                });
            }
        }

        // ── Validate language ────────────────────────────────────────
        if (!['eng', 'kh'].includes(test_language)) {
            return res.status(400).json({
                success: false,
                message: 'test_language must be "eng" or "kh"'
            });
        }

        // ── Validate answers array ───────────────────────────────────
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'answers must be a non-empty array'
            });
        }

        for (const ans of answers) {
            if (
                !Number.isInteger(ans.question_id) ||
                !['d', 'a', 's'].includes(ans.category) ||
                !Number.isInteger(ans.answer_value) ||
                ans.answer_value < 0 || ans.answer_value > 3
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Each answer must have question_id (int), category (d|a|s), answer_value (0–3)'
                });
            }
        }

        // ── Compute worst_level server-side ──────────────────────────
        const worst = worstLevel(depression_level, anxiety_level, stress_level);

        // ── Transaction ──────────────────────────────────────────────
        await conn.beginTransaction();

        // 1. Insert the result row
        const [resultRow] = await conn.query(
            `INSERT INTO dass_test_results
             (user_id,
              depression_score, anxiety_score, stress_score,
              depression_level, anxiety_level, stress_level,
              worst_level, test_language)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                depression_score, anxiety_score, stress_score,
                depression_level, anxiety_level, stress_level,
                worst, test_language,
            ]
        );

        const result_id = resultRow.insertId;

        // 2. Batch-insert all 21 answers in ONE query
        //    VALUES (r,q,c,v), (r,q,c,v), …
        const answerRows   = answers.map(a => [result_id, a.question_id, a.category, a.answer_value]);
        await conn.query(
            `INSERT INTO dass_test_answers
             (result_id, question_id, category, answer_value)
             VALUES ?`,
            [answerRows]                   // mysql2 expands this correctly
        );

        await conn.commit();

        return res.status(201).json({
            success    : true,
            message    : 'Result saved successfully',
            result_id,
            worst_level: worst,
        });

    } catch (err) {
        await conn.rollback();
        console.error('[saveResult]', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to save result'
        });
    } finally {
        conn.release();
    }
};

/* ── GET MY RESULTS ────────────────────────────────────────────────
   GET /api/results
   Headers: Authorization: Bearer <token>
   Query:   ?limit=20&offset=0

   Changes vs original:
   • SELECT only needed columns (not SELECT *)
   • Pagination via ?limit + ?offset
   • Returns total count alongside results
──────────────────────────────────────────────────────────────────── */
export const getMyResults = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const limit   = Math.min(parseInt(req.query.limit)  || 20, 100);  // max 100
        const offset  = Math.max(parseInt(req.query.offset) || 0,  0);

        // Run count + results in parallel
        const [[countRow], [results]] = await Promise.all([
            pool.query(
                'SELECT COUNT(*) AS total FROM dass_test_results WHERE user_id = ?',
                [user_id]
            ),
            pool.query(
                `SELECT result_id,
                        depression_score, anxiety_score, stress_score,
                        depression_level, anxiety_level, stress_level,
                        worst_level, test_language, created_at
                 FROM dass_test_results
                 WHERE user_id = ?
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?`,
                [user_id, limit, offset]
            ),
        ]);

        return res.json({
            success: true,
            total  : countRow[0].total,
            limit,
            offset,
            results,
        });

    } catch (err) {
        console.error('[getMyResults]', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/* ── GET RESULT DETAIL ─────────────────────────────────────────────
   GET /api/results/:id
   Headers: Authorization: Bearer <token>
   Returns a single result + all 21 answers.
   (This was missing from the original — needed for PDF export and
    for displaying a historical test in full.)
──────────────────────────────────────────────────────────────────── */
export const getResultDetail = async (req, res) => {
    try {
        const user_id   = req.user.user_id;
        const result_id = parseInt(req.params.id);

        if (!result_id) {
            return res.status(400).json({ success: false, message: 'Invalid result id' });
        }

        // Fetch result — must belong to the requesting user
        const [[result]] = await pool.query(
            `SELECT result_id, user_id,
                    depression_score, anxiety_score, stress_score,
                    depression_level, anxiety_level, stress_level,
                    worst_level, test_language, created_at
             FROM dass_test_results
             WHERE result_id = ? AND user_id = ?`,
            [result_id, user_id]
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        // Fetch associated answers
        const [answers] = await pool.query(
            `SELECT question_id, category, answer_value
             FROM dass_test_answers
             WHERE result_id = ?
             ORDER BY question_id ASC`,
            [result_id]
        );

        return res.json({
            success: true,
            result : { ...result, answers },
        });

    } catch (err) {
        console.error('[getResultDetail]', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/* ── DELETE RESULT ─────────────────────────────────────────────────
   DELETE /api/results/:id
   Headers: Authorization: Bearer <token>
   User can only delete their own results.
   Cascade in the schema deletes answers automatically.
──────────────────────────────────────────────────────────────────── */
export const deleteResult = async (req, res) => {
    try {
        const user_id   = req.user.user_id;
        const result_id = parseInt(req.params.id);

        const [del] = await pool.query(
            'DELETE FROM dass_test_results WHERE result_id = ? AND user_id = ?',
            [result_id, user_id]
        );

        if (del.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        return res.json({ success: true, message: 'Result deleted' });

    } catch (err) {
        console.error('[deleteResult]', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};