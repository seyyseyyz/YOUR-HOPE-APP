import pool from '../config/db.js';

/* ── CLINICS / SERVICES ────────────────────────────────────────────
   Public directory APIs. These make the clinic list flexible because
   the frontend can later load services from MySQL instead of hardcoding
   everything in data.js.
──────────────────────────────────────────────────────────────────── */

export const getClinics = async (req, res) => {
  try {
    const {
      q = '',
      type = '',
      nssf = '',
      limit = 100,
      offset = 0,
    } = req.query;

    const where = [];
    const params = [];

    if (q.trim()) {
      where.push('(name LIKE ? OR location LIKE ? OR category LIKE ? OR services LIKE ?)');
      const like = `%${q.trim()}%`;
      params.push(like, like, like, like);
    }

    if (type.trim()) {
      where.push('type = ?');
      params.push(type.trim());
    }

    if (nssf.trim()) {
      where.push('nssf = ?');
      params.push(nssf.trim());
    }

    const safeLimit = Math.min(parseInt(limit) || 100, 200);
    const safeOffset = Math.max(parseInt(offset) || 0, 0);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [[countRow], [clinics]] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM clinics ${whereSql}`, params),
      pool.query(
        `SELECT clinic_id, name, type, category, location, phone, email, website,
                map_url, opening_hours, target_group, nssf, services, description,
                is_active, created_at, updated_at
         FROM clinics
         ${whereSql}
         ORDER BY name ASC
         LIMIT ? OFFSET ?`,
        [...params, safeLimit, safeOffset]
      ),
    ]);

    return res.json({
      success: true,
      total: countRow[0].total,
      limit: safeLimit,
      offset: safeOffset,
      clinics,
    });
  } catch (err) {
    console.error('[getClinics]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getClinicById = async (req, res) => {
  try {
    const clinicId = parseInt(req.params.id);
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Invalid clinic id' });
    }

    const [rows] = await pool.query(
      `SELECT clinic_id, name, type, category, location, phone, email, website,
              map_url, opening_hours, target_group, nssf, services, description,
              is_active, created_at, updated_at
       FROM clinics
       WHERE clinic_id = ?
       LIMIT 1`,
      [clinicId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    return res.json({ success: true, clinic: rows[0] });
  } catch (err) {
    console.error('[getClinicById]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
