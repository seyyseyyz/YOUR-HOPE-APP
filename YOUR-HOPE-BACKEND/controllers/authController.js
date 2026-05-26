import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ── HELPERS ───────────────────────────────────────────────────────
   Kept private to this module — not exported.
──────────────────────────────────────────────────────────────────── */

// Simple email format check (DB unique constraint is the real guard)
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Build a JWT for the given user_id
const signToken = user_id =>
    jwt.sign(
        { user_id },
        process.env.JWT_SECRET,             // no fallback — fail loudly if missing
        { expiresIn: '7d' }
    );

/* ── SIGNUP ────────────────────────────────────────────────────────
   POST /api/auth/signup
   Body: { full_name, email, password, lang? }

   Changes vs original:
   • Validates email format before hitting the DB
   • Validates password minimum length (6 chars)
   • SELECT only email column for the duplicate check (not SELECT *)
   • Accepts optional lang field (stored in users table)
   • Returns the created user object (no password_hash)
──────────────────────────────────────────────────────────────────── */
export const signup = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            lang = 'eng'
        } = req.body;

        // ── Validation ─────────────────────────────────────────────
        if (!full_name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: 'full_name, email, and password are required'
            });
        }

        if (!isValidEmail(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        if (!['eng', 'kh'].includes(lang)) {
            return res.status(400).json({
                success: false,
                message: 'lang must be "eng" or "kh"'
            });
        }

        // ── Duplicate email check ────────────────────────────────────
        // SELECT only the column we need — avoids fetching password_hash
        const [existing] = await pool.query(
            'SELECT email FROM users WHERE email = ? LIMIT 1',
            [email.trim().toLowerCase()]
        );

        if (existing.length > 0) {
            return res.status(409).json({      // 409 Conflict is more correct than 400
                success: false,
                message: 'Email already registered'
            });
        }

        // ── Hash + insert ────────────────────────────────────────────
        const password_hash = await bcrypt.hash(password, 12);  // 12 rounds (10 is fine but 12 is current best practice)

        const [result] = await pool.query(
            `INSERT INTO users (full_name, email, password_hash, lang)
             VALUES (?, ?, ?, ?)`,
            [full_name.trim(), email.trim().toLowerCase(), password_hash, lang]
        );

        return res.status(201).json({
            success: true,
            message: 'Signup successful',
            user: {
                user_id  : result.insertId,
                full_name: full_name.trim(),
                email    : email.trim().toLowerCase(),
                lang,
            }
        });

    } catch (err) {
        console.error('[signup]', err);
        return res.status(500).json({
            success: false,
            message: 'Signup failed'
        });
    }
};

/* ── LOGIN ─────────────────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }

   Changes vs original:
   • SELECT only the columns we need (not SELECT *)
   • Returns 401 for both "not found" and "wrong password" —
     never reveal which one (security: user enumeration)
   • Updates last_login_at on success
   • Falls back to nothing if JWT_SECRET is missing — crashes loudly
──────────────────────────────────────────────────────────────────── */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ── Validation ─────────────────────────────────────────────
        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // ── Fetch user (only needed columns) ─────────────────────────
        const [rows] = await pool.query(
            `SELECT user_id, full_name, email, password_hash, lang, status
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email.trim().toLowerCase()]
        );

        const user = rows[0];

        // ── Always hash before comparing — prevents timing attacks ──
        const isMatch = user
            ? await bcrypt.compare(password, user.password_hash)
            : await bcrypt.compare(password, '$2a$12$invalidhashpadding000000000000000000000000000000000000');

        if (!user || !isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'   // same message for both cases
            });
        }

        // ── Check account status ─────────────────────────────────────
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is not active'
            });
        }

        // ── Update last_login_at (fire-and-forget — don't await) ────
        pool.query(
            'UPDATE users SET last_login_at = NOW() WHERE user_id = ?',
            [user.user_id]
        ).catch(err => console.error('[login] last_login_at update failed:', err));

        // ── Sign token + respond ─────────────────────────────────────
        const token = signToken(user.user_id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id  : user.user_id,
                full_name: user.full_name,
                email    : user.email,
                lang     : user.lang,
            }
        });

    } catch (err) {
        console.error('[login]', err);
        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

/* ── GET ME ────────────────────────────────────────────────────────
   GET /api/auth/me   (requires verifyToken middleware)
   Returns the current user's profile. Useful so the frontend
   can refresh user info after a page reload without re-logging-in.
──────────────────────────────────────────────────────────────────── */
export const getMe = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT user_id, full_name, email, lang, status, last_login_at, created_at
             FROM users
             WHERE user_id = ?
             LIMIT 1`,
            [req.user.user_id]
        );

        if (!rows.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, user: rows[0] });

    } catch (err) {
        console.error('[getMe]', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};