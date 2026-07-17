# ViralIQ Backend (Pro Edition)

AI-powered viral content & digital marketing assistant — Express.js backend with Prisma ORM, Socket.io, and Claude AI.

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY and DATABASE_URL
```

### 3. Initialize Database
```bash
npx prisma db push
```

### 4. Run the server
```bash
npm run dev     # development with nodemon
npm start       # production
```

Server starts at `http://localhost:3001`

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── index.js           # Server entry + Socket.io + Jobs init
│   ├── controllers/       # Business logic (Content, Calendar, etc.)
│   ├── routes/            # API Route definitions
│   ├── services/          # AI Service (Claude) & Background Jobs
│   └── middleware/        # Auth verification & Global Error Handler
├── prisma/
│   └── schema.prisma      # Advanced "Pro" Database Models
├── .env.example
└── package.json
```

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ YES | Get at console.anthropic.com |
| `DATABASE_URL` | ✅ YES | Prisma connection string (e.g., file:./dev.db) |
| `JWT_SECRET` | ✅ YES | Any long random string |

## 🔌 Frontend Integration

Add to your frontend's API setup:
```js
// src/api/client.js
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3001/api' });

client.interceptors.request.use(config => {
  const token = localStorage.getItem('viraliq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
```

## 🌐 Real-Time (Socket.io)
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Subscribe to Trends
socket.emit('subscribe:trends', 'Tech');
socket.on('trend:update', (data) => console.log('New trends!', data));

// Subscribe to Reminders
socket.emit('subscribe:user', userId);
socket.on('schedule:reminder', (data) => console.log('Post Reminder:', data));
```
