import pool from '../config/db.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, role, status FROM users WHERE user_id = ? LIMIT 1',
      [req.user.user_id]
    );

    const user = rows[0];
    if (!user || user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is not active' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user.role = user.role;
    next();
  } catch (err) {
    console.error('[requireAdmin]', err);
    return res.status(500).json({ success: false, message: 'Admin check failed' });
  }
};
