import express from 'express';
import { generate, getHistory, getContentDetail } from '../controllers/content.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authMiddleware, generate);
router.get('/history', authMiddleware, getHistory);
router.get('/:id', authMiddleware, getContentDetail);

export default router;
