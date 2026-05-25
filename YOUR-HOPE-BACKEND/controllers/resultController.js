import pool from '../config/db.js';

export const saveResult = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            depression_score,
            anxiety_score,
            stress_score,

            depression_level,
            anxiety_level,
            stress_level,

            test_language,

            answers
        } = req.body;

        const [result] = await pool.query(
            `
            INSERT INTO dass_test_results
            (
                user_id,

                depression_score,
                anxiety_score,
                stress_score,

                depression_level,
                anxiety_level,
                stress_level,

                test_language
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,

                depression_score,
                anxiety_score,
                stress_score,

                depression_level,
                anxiety_level,
                stress_level,

                test_language
            ]
        );

        const result_id = result.insertId;

        for (const ans of answers) {

            await pool.query(
                `
                INSERT INTO dass_test_answers
                (
                    result_id,
                    question_id,
                    category,
                    answer_value
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    result_id,
                    ans.question_id,
                    ans.category,
                    ans.answer_value
                ]
            );
        }

        res.status(201).json({
            message: 'Result saved successfully'
        });

    } catch (error) {

        res.status(500).json(error);

    }
};

export const getMyResults = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const [results] = await pool.query(
            `
            SELECT *
            FROM dass_test_results
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [user_id]
        );

        res.json(results);

    } catch (error) {

        res.status(500).json(error);

    }
};
