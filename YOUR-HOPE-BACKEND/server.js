import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

/* ─────────────────────────────────────────────
   CORS CONFIG
   Allows local frontend + deployed Netlify frontend
   ───────────────────────────────────────────── */

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  'https://symphonious-pegasus-d35df6.netlify.app',
  'https://your-hope-app-production.up.railway.app'
];

const corsOptions = {
  origin(origin, callback) {
    // Allow Postman, curl, Railway health checks, and same-origin requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Netlify preview deployments for this project
    if (origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Handles browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());

/* ─────────────────────────────────────────────
   ROUTES
   ───────────────────────────────────────────── */

app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat-messages', chatRoutes);
app.use('/api/admin', adminRoutes);

/* ─────────────────────────────────────────────
   HEALTH CHECK
   ───────────────────────────────────────────── */

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'YOUR HOPE backend is running'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'YOUR HOPE API is running'
  });
});

/* ─────────────────────────────────────────────
   404 HANDLER
   ───────────────────────────────────────────── */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ─────────────────────────────────────────────
   ERROR HANDLER
   ───────────────────────────────────────────── */

app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

/* ─────────────────────────────────────────────
   START SERVER
   ───────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`YOUR HOPE backend running on port ${PORT}`);
});