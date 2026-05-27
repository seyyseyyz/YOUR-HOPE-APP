import pool from '../config/db.js';

/* ── QUOTES ────────────────────────────────────────────────────────
   Motivational quote APIs. Frontend can later call /api/quotes/random
   instead of keeping quotes only in JavaScript.
──────────────────────────────────────────────────────────────────── */

export const getQuotes = async (req, res) => {
  try {
    const { lang = '', category = '', limit = 50, offset = 0 } = req.query;
    const where = ['is_active = 1'];
    const params = [];

    if (lang) {
      if (!['eng', 'kh'].includes(lang)) {
        return res.status(400).json({ success: false, message: 'lang must be eng or kh' });
      }
      where.push('language = ?');
      params.push(lang);
    }

    if (category) {
      where.push('category = ?');
      params.push(category);
    }

    const safeLimit = Math.min(parseInt(limit) || 50, 100);
    const safeOffset = Math.max(parseInt(offset) || 0, 0);

    const [quotes] = await pool.query(
      `SELECT quote_id, quote_text, language, category, is_active, created_at
       FROM quotes
       WHERE ${where.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, safeOffset]
    );

    return res.json({ success: true, quotes });
  } catch (err) {
    console.error('[getQuotes]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRandomQuote = async (req, res) => {
  try {
    const lang = ['eng', 'kh'].includes(req.query.lang) ? req.query.lang : 'eng';

    const [rows] = await pool.query(
      `SELECT quote_id, quote_text, language, category
       FROM quotes
       WHERE language = ? AND is_active = 1
       ORDER BY RAND()
       LIMIT 1`,
      [lang]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'No quote found' });
    }

    return res.json({ success: true, quote: rows[0] });
  } catch (err) {
    console.error('[getRandomQuote]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
