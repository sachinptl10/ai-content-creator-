import express from 'express';
import { getVideoInfo, downloadAudio } from '../controllers/audio.controller.js';

const router = express.Router();

// GET /api/audio/info?url=<videoUrl>   — fetch title, duration, thumbnail
router.get('/info', getVideoInfo);

// POST /api/audio/download  body: { url }  — stream MP3 to client
router.post('/download', downloadAudio);

export default router;
