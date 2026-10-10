import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { googleLogin } from '../controllers/google.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', authMiddleware, getMe);

export default router;
