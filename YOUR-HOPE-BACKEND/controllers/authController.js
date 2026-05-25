import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ================= SIGNUP =================
export const signup = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Validate input
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check existing email
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.query(
            `
            INSERT INTO users
            (full_name, email, password_hash)
            VALUES (?, ?, ?)
            `,
            [full_name, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: 'Signup successful',
            user_id: result.insertId
        });

    } catch (error) {

        console.error('SIGNUP ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Signup failed',
            error: error.message
        });
    }
};

// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required'
            });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Wrong password'
            });
        }

        // Create token
        const token = jwt.sign(
            {
                user_id: user.user_id
            },
            process.env.JWT_SECRET || 'secretkey',
            {
                expiresIn: '7d'
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {

        console.error('LOGIN ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};