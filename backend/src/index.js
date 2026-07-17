import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import trendsRoutes from './routes/trends.routes.js';
import analyticsRouter from './routes/analytics.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import strategyRoutes from './routes/strategy.routes.js';
import audioRoutes from './routes/audio.routes.js';
import chatRoutes from './routes/chat.routes.js';

import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { startTrendRefreshJob, startScheduleReminderJob } from './services/jobs.service.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// ── Security & Middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  }, 
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json({ limit: "10mb" }));

// Rate Limiting (Protects AI Credits) - DISABLED as per user request for no limits
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 99999999, // Virtually unlimited API calls
  message: "Too many requests" 
});
app.use("/api/", limiter);

// ── Routes ────────────────────────────────────────────────────────────────────

// Public Routes
app.use('/api/auth', authRoutes);
app.get('/api/health', (_, res) => res.json({ status: "ok", time: new Date() }));

// Protected Routes (Required for "Pro" features)
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/content', authenticateToken, contentRoutes);
app.use('/api/trends', authenticateToken, trendsRoutes);
app.use('/api/analytics', authenticateToken, analyticsRouter);
app.use('/api/calendar', authenticateToken, calendarRoutes);
app.use('/api/strategy', authenticateToken, strategyRoutes);
app.use('/api/audio', authenticateToken, audioRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

// ── Static Frontend Serving (Prod) ────────────────────────────────────────────
// Serve the built React static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// ── WebSocket – real-time trend pushes ────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('subscribe:trends', (niche) => {
    socket.join(`trends:${niche}`);
    console.log(`📡 Client ${socket.id} subscribed to trends: ${niche}`);
  });

  socket.on('subscribe:user', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`👤 Client ${socket.id} subscribed to user notifications: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('🚽 Client disconnected:', socket.id);
  });
});

export { io };

// Global Error Handler
app.use(errorHandler);

// Start Server & Jobs (Only start HTTP server if not in a serverless environment like Vercel)
if (!process.env.VERCEL) {
  httpServer.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 ViralIQ Backend + WebSockets running on port ${PORT}`);
    
    // Start background jobs
    startTrendRefreshJob(io);
    startScheduleReminderJob(io);
    
    console.log('⏰ Background Cron Jobs started');
  });
}

// Export for serverless environments
export default app;
