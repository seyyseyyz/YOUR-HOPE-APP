import { Router } from 'express';
import { getClinics, getClinicById } from '../controllers/clinicController.js';

const router = Router();

router.get('/', getClinics);
router.get('/:id', getClinicById);

export default router;
