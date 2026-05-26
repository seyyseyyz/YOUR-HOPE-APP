import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login',  login);
router.get ('/me',     verifyToken, getMe);   // protected — returns current user

export default router;