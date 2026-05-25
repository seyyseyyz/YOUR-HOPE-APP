import express from 'express';

import {
    saveResult,
    getMyResults
} from '../controllers/resultController.js';

import {
    verifyToken
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, saveResult);
router.get('/me', verifyToken, getMyResults);

export default router;
