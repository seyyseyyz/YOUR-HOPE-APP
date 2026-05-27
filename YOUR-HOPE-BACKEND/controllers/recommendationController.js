import pool from '../config/db.js';

const VALID_LEVELS = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];

/* ── RECOMMENDATIONS ───────────────────────────────────────────────
   Stores advice by severity level and language. This makes result
   recommendations editable from the database later.
──────────────────────────────────────────────────────────────────── */

export const getRecommendations = async (req, res) => {
  try {
    const { level = '', lang = '' } = req.query;
    const where = ['is_active = 1'];
    const params = [];

    if (level) {
      if (!VALID_LEVELS.includes(level)) {
        return res.status(400).json({ success: false, message: 'Invalid level' });
      }
      where.push('level = ?');
      params.push(level);
    }

    if (lang) {
      if (!['eng', 'kh'].includes(lang)) {
        return res.status(400).json({ success: false, message: 'lang must be eng or kh' });
      }
      where.push('language = ?');
      params.push(lang);
    }

    const [recommendations] = await pool.query(
      `SELECT recommendation_id, level, language, title, summary, tips, is_active,
              created_at, updated_at
       FROM recommendations
       WHERE ${where.join(' AND ')}
       ORDER BY FIELD(level, 'Normal','Mild','Moderate','Severe','Extremely Severe'), language`,
      params
    );

    return res.json({ success: true, recommendations });
  } catch (err) {
    console.error('[getRecommendations]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
