import { Router } from 'express';
import {
  saveChatMessage,
  getMyChatMessages,
  clearMyChatMessages,
} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);
router.post('/', saveChatMessage);
router.get('/', getMyChatMessages);
router.delete('/', clearMyChatMessages);

export default router;
