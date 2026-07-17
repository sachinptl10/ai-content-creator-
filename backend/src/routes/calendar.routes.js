import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { 
  getCalendar, 
  createCalendarEntry, 
  generateCalendar, 
  updateCalendarEntry, 
  deleteCalendarEntry,
  clearCalendar
} from '../controllers/calendar.controller.js';

const router = express.Router();

// GET /api/calendar
router.get('/', authMiddleware, getCalendar);

// POST /api/calendar
router.post('/', authMiddleware, createCalendarEntry);

// POST /api/calendar/generate (AI-powered scheduling)
router.post('/generate', authMiddleware, generateCalendar);

// PATCH /api/calendar/:id
router.patch('/:id', authMiddleware, updateCalendarEntry);

// DELETE /api/calendar/clear (Delete all entries)
router.delete('/clear', authMiddleware, clearCalendar);

// DELETE /api/calendar/:id
router.delete('/:id', authMiddleware, deleteCalendarEntry);

export default router;
