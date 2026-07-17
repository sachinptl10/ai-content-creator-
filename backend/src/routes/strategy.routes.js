import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  generate, 
  getAllStrategies, 
  getStrategyDetail, 
  deleteStrategy 
} from '../controllers/strategy.controller.js';

const router = express.Router();

// GET /api/strategy
router.get('/', authMiddleware, getAllStrategies);

// GET /api/strategy/:id
router.get('/:id', authMiddleware, getStrategyDetail);

// POST /api/strategy/generate
router.post('/generate', authMiddleware, generate);

// DELETE /api/strategy/:id
router.delete('/:id', authMiddleware, deleteStrategy);

export default router;
