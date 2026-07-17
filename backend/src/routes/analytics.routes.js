import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  getFullAnalytics, 
  getOverview, 
  getContentAnalytics, 
  getBestTimes 
} from '../controllers/analytics.controller.js';

const router = express.Router();

// GET /api/analytics/overview
router.get('/overview', authMiddleware, getOverview);

// GET /api/analytics/full
router.get('/full', authMiddleware, getFullAnalytics);

// GET /api/analytics/content/:id
router.get('/content/:id', authMiddleware, getContentAnalytics);

// GET /api/analytics/best-times
router.get('/best-times', authMiddleware, getBestTimes);

export default router;
