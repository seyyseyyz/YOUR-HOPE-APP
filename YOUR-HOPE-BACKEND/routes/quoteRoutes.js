import { Router } from 'express';
import { getQuotes, getRandomQuote } from '../controllers/quoteController.js';

const router = Router();

router.get('/', getQuotes);
router.get('/random', getRandomQuote);

export default router;
