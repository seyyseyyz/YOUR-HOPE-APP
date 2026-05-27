import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes   from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5001;

/* ── MIDDLEWARE ───────────────────────────────────────────────────── */
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5001',
    'http://127.0.0.1:5001',
    'https://symphonious-pegasus-d35df6.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

/* ── ROUTES ───────────────────────────────────────────────────────── */
app.use('/api/auth',    authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat-messages', chatRoutes);
app.use('/api/admin', adminRoutes);

/* ── HEALTH CHECK ─────────────────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* ── 404 ──────────────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

/* ── START ────────────────────────────────────────────────────────── */
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));