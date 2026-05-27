import pool from '../config/db.js';

/* ── CHAT HISTORY ──────────────────────────────────────────────────
   Stores user/assistant messages if you want to show chat history later.
──────────────────────────────────────────────────────────────────── */

export const saveChatMessage = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { role, message } = req.body;

    if (!['user', 'assistant'].includes(role) || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'role must be user or assistant, and message is required'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO chat_messages (user_id, role, message)
       VALUES (?, ?, ?)`,
      [userId, role, message.trim()]
    );

    return res.status(201).json({
      success: true,
      message_id: result.insertId,
    });
  } catch (err) {
    console.error('[saveChatMessage]', err);
    return res.status(500).json({ success: false, message: 'Failed to save chat message' });
  }
};

export const getMyChatMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    const [messages] = await pool.query(
      `SELECT message_id, role, message, created_at
       FROM chat_messages
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );

    return res.json({ success: true, messages: messages.reverse() });
  } catch (err) {
    console.error('[getMyChatMessages]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const clearMyChatMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await pool.query('DELETE FROM chat_messages WHERE user_id = ?', [userId]);
    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    console.error('[clearMyChatMessages]', err);
    return res.status(500).json({ success: false, message: 'Failed to clear chat history' });
  }
};
