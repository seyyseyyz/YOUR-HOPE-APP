import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes   from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── MIDDLEWARE ───────────────────────────────────────────────────── */
app.use(cors());
app.use(express.json());

/* ── ROUTES ───────────────────────────────────────────────────────── */
app.use('/api/auth',    authRoutes);
app.use('/api/results', resultRoutes);

/* ── HEALTH CHECK ─────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ── 404 ──────────────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── START ────────────────────────────────────────────────────────── */
app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));