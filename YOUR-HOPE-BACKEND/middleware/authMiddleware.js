import jwt from 'jsonwebtoken';

/* ── VERIFY TOKEN ──────────────────────────────────────────────────
   Attaches req.user = { user_id, iat, exp } on success.

   Changes vs original:
   • Checks that the Authorization header starts with "Bearer "
   • Distinguishes expired tokens (useful for frontend auto-refresh UX)
   • Uses process.env.JWT_SECRET directly — crashes loudly if missing
     instead of silently accepting any token
──────────────────────────────────────────────────────────────────── */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Header missing entirely
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header missing'
        });
    }

    // Header present but wrong format
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header must be: Bearer <token>'
        });
    }

    const token = authHeader.slice(7);   // trim "Bearer "

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();

    } catch (err) {
        // Tell the client whether the token has expired so it can
        // show a "session expired — please log in again" message
        const expired = err.name === 'TokenExpiredError';
        return res.status(401).json({
            success: false,
            message: expired ? 'Session expired — please log in again' : 'Invalid token'
        });
    }
};