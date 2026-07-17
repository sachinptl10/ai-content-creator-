import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getStats, getNotifications } from '../controllers/dashboard.controller.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, getStats);

// GET /api/dashboard/notifications
router.get('/notifications', authMiddleware, getNotifications);

export default router;
