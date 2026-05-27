import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  getAdminSummary,
  listUsers,
  updateUser,
  listResults,
  createClinic,
  updateClinic,
  deleteClinic,
  listQuotesAdmin,
  createQuote,
  updateQuote,
  deleteQuote,
} from '../controllers/adminController.js';

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/summary', getAdminSummary);
router.get('/users', listUsers);
router.patch('/users/:id', updateUser);
router.get('/results', listResults);

router.post('/clinics', createClinic);
router.patch('/clinics/:id', updateClinic);
router.delete('/clinics/:id', deleteClinic);

router.get('/quotes', listQuotesAdmin);
router.post('/quotes', createQuote);
router.patch('/quotes/:id', updateQuote);
router.delete('/quotes/:id', deleteQuote);

export default router;
