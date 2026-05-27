import pool from '../config/db.js';

const VALID_STATUS = ['pending', 'confirmed', 'cancelled', 'completed'];

/* ── APPOINTMENTS ──────────────────────────────────────────────────
   Protected APIs. Users can save appointment requests/bookmarks for
   mental health services.
──────────────────────────────────────────────────────────────────── */

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { clinic_id, appointment_date, appointment_time, reason = '' } = req.body;

    if (!Number.isInteger(clinic_id) || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'clinic_id, appointment_date, and appointment_time are required'
      });
    }

    const [clinicRows] = await pool.query('SELECT clinic_id FROM clinics WHERE clinic_id = ? LIMIT 1', [clinic_id]);
    if (!clinicRows.length) {
      return res.status(404).json({ success: false, message: 'Clinic not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO appointments
       (user_id, clinic_id, appointment_date, appointment_time, reason, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, clinic_id, appointment_date, appointment_time, reason.trim().slice(0, 500)]
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment request created',
      appointment_id: result.insertId,
      status: 'pending',
    });
  } catch (err) {
    console.error('[createAppointment]', err);
    return res.status(500).json({ success: false, message: 'Failed to create appointment' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [appointments] = await pool.query(
      `SELECT a.appointment_id, a.clinic_id, c.name AS clinic_name, c.location,
              a.appointment_date, a.appointment_time, a.reason, a.status,
              a.created_at, a.updated_at
       FROM appointments a
       JOIN clinics c ON c.clinic_id = a.clinic_id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [userId]
    );

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error('[getMyAppointments]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const appointmentId = parseInt(req.params.id);
    const { status } = req.body;

    if (!appointmentId || !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment id or status' });
    }

    const [result] = await pool.query(
      `UPDATE appointments
       SET status = ?
       WHERE appointment_id = ? AND user_id = ?`,
      [status, appointmentId, userId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.json({ success: true, message: 'Appointment updated' });
  } catch (err) {
    console.error('[updateAppointmentStatus]', err);
    return res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
};
