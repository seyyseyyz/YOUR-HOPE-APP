import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/* ── CONNECTION POOL ───────────────────────────────────────────────
   Changes vs original:
   • Added charset + timezone so Khmer text and timestamps are safe
   • Added connectTimeout to fail fast on bad credentials
   • Added queueLimit so runaway queues don't hang forever
   • Kept connectionLimit: 10 (fine for a small app)
──────────────────────────────────────────────────────────────────── */
const pool = mysql.createPool({
    host              : process.env.DB_HOST,
    port              : process.env.DB_PORT || 3306,
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME,
    charset           : 'utf8mb4',          // full Unicode — needed for Khmer
    timezone          : '+00:00',           // store everything as UTC
    waitForConnections: true,
    connectionLimit   : 10,
    queueLimit        : 50,                 // reject after 50 queued requests
    connectTimeout    : 10_000,             // 10 s — fail fast on bad config
});

/* ── BOOT CHECK ────────────────────────────────────────────────────
   Grab one connection on startup so a missing .env is caught
   immediately instead of on the first API call.
──────────────────────────────────────────────────────────────────── */
pool.getConnection()
    .then(conn => {
        console.log('✅  MySQL connected —', process.env.DB_NAME);
        conn.release();
    })
    .catch(err => {
        console.error('❌  MySQL connection failed:', err.message);
        process.exit(1);   // no point running the server without a DB
    });

export default pool;