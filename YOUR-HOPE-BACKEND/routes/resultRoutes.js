import { Router } from 'express';
import {
    saveResult,
    getMyResults,
    getResultDetail,
    deleteResult,
} from '../controllers/resultController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// All result routes require a valid token
router.use(verifyToken);

router.post  ('/',    saveResult);        // save a new test result
router.get   ('/',    getMyResults);      // list my results  (?limit=20&offset=0)
router.get   ('/:id', getResultDetail);   // full result + answers by id
router.delete('/:id', deleteResult);      // delete one result

export default router;