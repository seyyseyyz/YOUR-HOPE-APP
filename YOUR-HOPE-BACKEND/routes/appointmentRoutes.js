import { Router } from 'express';
import {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);
router.post('/', createAppointment);
router.get('/', getMyAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
