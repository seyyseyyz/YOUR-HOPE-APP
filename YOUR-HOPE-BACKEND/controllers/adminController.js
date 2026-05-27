import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const VALID_ROLES = ['user', 'admin'];
const VALID_STATUS = ['active', 'inactive', 'blocked'];
const VALID_LEVELS = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];
const VALID_CLINIC_TYPES = ['Clinic', 'Hospital', 'NGO', 'Service'];
const VALID_NSSF = ['Yes', 'No'];

const cleanInt = (value, fallback = 20, max = 100) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
};

const jsonTips = value => {
  if (Array.isArray(value)) return JSON.stringify(value.filter(Boolean));
  if (typeof value === 'string' && value.trim()) {
    return JSON.stringify(value.split('\n').map(v => v.trim()).filter(Boolean));
  }
  return null;
};

export const getAdminSummary = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
        (SELECT COUNT(*) FROM users WHERE status = 'active') AS active_users,
        (SELECT COUNT(*) FROM dass_test_results) AS total_tests,
        (SELECT COUNT(*) FROM dass_test_results WHERE worst_level IN ('Severe','Extremely Severe')) AS high_risk_tests,
        (SELECT COUNT(*) FROM clinics) AS total_clinics,
        (SELECT COUNT(*) FROM quotes WHERE is_active = 1) AS active_quotes,
        (SELECT ROUND(AVG(depression_score), 1) FROM dass_test_results) AS avg_depression,
        (SELECT ROUND(AVG(anxiety_score), 1) FROM dass_test_results) AS avg_anxiety,
        (SELECT ROUND(AVG(stress_score), 1) FROM dass_test_results) AS avg_stress
    `);

    const [riskRows] = await pool.query(`
      SELECT worst_level, COUNT(*) AS total
      FROM dass_test_results
      GROUP BY worst_level
      ORDER BY FIELD(worst_level, 'Normal','Mild','Moderate','Severe','Extremely Severe')
    `);

    const [recentResults] = await pool.query(`
      SELECT r.result_id, r.user_id, u.full_name, u.email, r.depression_score, r.anxiety_score,
             r.stress_score, r.worst_level, r.test_language, r.created_at
      FROM dass_test_results r
      JOIN users u ON u.user_id = r.user_id
      ORDER BY r.created_at DESC
      LIMIT 8
    `);

    return res.json({ success: true, summary: rows[0], risk_breakdown: riskRows, recent_results: recentResults });
  } catch (err) {
    console.error('[getAdminSummary]', err);
    return res.status(500).json({ success: false, message: 'Failed to load admin summary' });
  }
};

export const listUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const role = (req.query.role || '').trim();
    const status = (req.query.status || '').trim();
    const limit = cleanInt(req.query.limit, 30, 100);
    const offset = cleanInt(req.query.offset, 0, 100000);

    const where = [];
    const params = [];

    if (q) {
      where.push('(full_name LIKE ? OR email LIKE ? OR job LIKE ?)');
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    if (VALID_ROLES.includes(role)) { where.push('role = ?'); params.push(role); }
    if (VALID_STATUS.includes(status)) { where.push('status = ?'); params.push(status); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [[countRow], [users]] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM users ${whereSql}`, params),
      pool.query(
        `SELECT user_id, full_name, email, job, age, gender, lang, role, status, last_login_at, created_at, updated_at
         FROM users
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ]);

    return res.json({ success: true, total: countRow[0].total, limit, offset, users });
  } catch (err) {
    console.error('[listUsers]', err);
    return res.status(500).json({ success: false, message: 'Failed to load users' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const { full_name, job, age, gender, lang, role, status } = req.body;
    const fields = [];
    const params = [];

    if (typeof full_name === 'string' && full_name.trim()) { fields.push('full_name = ?'); params.push(full_name.trim().slice(0, 100)); }
    if (job === null || typeof job === 'string') { fields.push('job = ?'); params.push(job && job.trim() ? job.trim().slice(0, 120) : null); }
    if (age === null || Number.isInteger(age)) { fields.push('age = ?'); params.push(Number.isInteger(age) && age >= 1 && age <= 120 ? age : null); }
    if (gender === null || ['male', 'female', 'other', 'prefer_not_to_say'].includes(gender)) { fields.push('gender = ?'); params.push(gender || null); }
    if (['eng', 'kh'].includes(lang)) { fields.push('lang = ?'); params.push(lang); }
    if (VALID_ROLES.includes(role)) { fields.push('role = ?'); params.push(role); }
    if (VALID_STATUS.includes(status)) { fields.push('status = ?'); params.push(status); }

    if (!fields.length) return res.status(400).json({ success: false, message: 'No valid fields to update' });

    params.push(userId);
    const [result] = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, message: 'User updated' });
  } catch (err) {
    console.error('[updateUser]', err);
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const listResults = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const level = (req.query.level || '').trim();
    const limit = cleanInt(req.query.limit, 30, 100);
    const offset = cleanInt(req.query.offset, 0, 100000);

    const where = [];
    const params = [];
    if (q) {
      where.push('(u.full_name LIKE ? OR u.email LIKE ?)');
      const like = `%${q}%`;
      params.push(like, like);
    }
    if (VALID_LEVELS.includes(level)) { where.push('r.worst_level = ?'); params.push(level); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[countRow], [results]] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM dass_test_results r JOIN users u ON u.user_id = r.user_id ${whereSql}`, params),
      pool.query(
        `SELECT r.result_id, r.user_id, u.full_name, u.email, u.job, u.age, u.gender,
                r.depression_score, r.anxiety_score, r.stress_score,
                r.depression_level, r.anxiety_level, r.stress_level, r.worst_level,
                r.test_language, r.created_at
         FROM dass_test_results r
         JOIN users u ON u.user_id = r.user_id
         ${whereSql}
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ]);

    return res.json({ success: true, total: countRow[0].total, limit, offset, results });
  } catch (err) {
    console.error('[listResults]', err);
    return res.status(500).json({ success: false, message: 'Failed to load results' });
  }
};

export const createClinic = async (req, res) => {
  try {
    const { name, type = 'Clinic', category = null, location = null, phone = null, email = null, website = null, map_url = null, opening_hours = null, target_group = null, nssf = 'No', services = null, description = null } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Clinic name is required' });
    if (!VALID_CLINIC_TYPES.includes(type)) return res.status(400).json({ success: false, message: 'Invalid clinic type' });
    if (!VALID_NSSF.includes(nssf)) return res.status(400).json({ success: false, message: 'Invalid NSSF value' });

    const [result] = await pool.query(
      `INSERT INTO clinics (name, type, category, location, phone, email, website, map_url, opening_hours, target_group, nssf, services, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), type, category, location, phone, email, website, map_url, opening_hours, target_group, nssf, services, description]
    );
    return res.status(201).json({ success: true, message: 'Clinic created', clinic_id: result.insertId });
  } catch (err) {
    console.error('[createClinic]', err);
    return res.status(500).json({ success: false, message: 'Failed to create clinic' });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const clinicId = parseInt(req.params.id, 10);
    if (!clinicId) return res.status(400).json({ success: false, message: 'Invalid clinic id' });
    const allowed = ['name','type','category','location','phone','email','website','map_url','opening_hours','target_group','nssf','services','description','is_active'];
    const fields = [];
    const params = [];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (key === 'type' && !VALID_CLINIC_TYPES.includes(req.body[key])) continue;
        if (key === 'nssf' && !VALID_NSSF.includes(req.body[key])) continue;
        fields.push(`${key} = ?`);
        params.push(req.body[key]);
      }
    }
    if (!fields.length) return res.status(400).json({ success: false, message: 'No valid fields to update' });
    params.push(clinicId);
    const [result] = await pool.query(`UPDATE clinics SET ${fields.join(', ')} WHERE clinic_id = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Clinic not found' });
    return res.json({ success: true, message: 'Clinic updated' });
  } catch (err) {
    console.error('[updateClinic]', err);
    return res.status(500).json({ success: false, message: 'Failed to update clinic' });
  }
};

export const deleteClinic = async (req, res) => {
  try {
    const clinicId = parseInt(req.params.id, 10);
    if (!clinicId) return res.status(400).json({ success: false, message: 'Invalid clinic id' });
    const [result] = await pool.query('DELETE FROM clinics WHERE clinic_id = ?', [clinicId]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Clinic not found' });
    return res.json({ success: true, message: 'Clinic deleted' });
  } catch (err) {
    console.error('[deleteClinic]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete clinic' });
  }
};

export const createQuote = async (req, res) => {
  try {
    const { quote_text, language = 'eng', category = 'hope', is_active = true } = req.body;
    if (!quote_text?.trim()) return res.status(400).json({ success: false, message: 'Quote text is required' });
    if (!['eng', 'kh'].includes(language)) return res.status(400).json({ success: false, message: 'Invalid language' });
    const [result] = await pool.query(
      `INSERT INTO quotes (quote_text, language, category, is_active) VALUES (?, ?, ?, ?)`,
      [quote_text.trim(), language, category || 'hope', !!is_active]
    );
    return res.status(201).json({ success: true, message: 'Quote created', quote_id: result.insertId });
  } catch (err) {
    console.error('[createQuote]', err);
    return res.status(500).json({ success: false, message: 'Failed to create quote' });
  }
};

export const listQuotesAdmin = async (req, res) => {
  try {
    const [quotes] = await pool.query(`SELECT quote_id, quote_text, language, category, is_active, created_at FROM quotes ORDER BY created_at DESC LIMIT 100`);
    return res.json({ success: true, quotes });
  } catch (err) {
    console.error('[listQuotesAdmin]', err);
    return res.status(500).json({ success: false, message: 'Failed to load quotes' });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    const { quote_text, language, category, is_active } = req.body;
    const fields = [];
    const params = [];
    if (typeof quote_text === 'string' && quote_text.trim()) { fields.push('quote_text = ?'); params.push(quote_text.trim()); }
    if (['eng', 'kh'].includes(language)) { fields.push('language = ?'); params.push(language); }
    if (typeof category === 'string') { fields.push('category = ?'); params.push(category || 'hope'); }
    if (typeof is_active === 'boolean') { fields.push('is_active = ?'); params.push(is_active); }
    if (!quoteId || !fields.length) return res.status(400).json({ success: false, message: 'Invalid quote update' });
    params.push(quoteId);
    const [result] = await pool.query(`UPDATE quotes SET ${fields.join(', ')} WHERE quote_id = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Quote not found' });
    return res.json({ success: true, message: 'Quote updated' });
  } catch (err) {
    console.error('[updateQuote]', err);
    return res.status(500).json({ success: false, message: 'Failed to update quote' });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (!quoteId) return res.status(400).json({ success: false, message: 'Invalid quote id' });
    const [result] = await pool.query('DELETE FROM quotes WHERE quote_id = ?', [quoteId]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Quote not found' });
    return res.json({ success: true, message: 'Quote deleted' });
  } catch (err) {
    console.error('[deleteQuote]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete quote' });
  }
};
