# ViralIQ Backend API Documentation

Base URL: `http://localhost:3001/api`

All protected routes require header: `Authorization: Bearer <token>`

---

## 🔐 AUTH

### POST `/auth/register`
```json
Body: { "name": "Sachin", "email": "s@example.com", "password": "secret", "niche": "Tech" }
Response: { "token": "...", "user": { "id", "name", "email", "plan", "credits", "niche" } }
```

### POST `/auth/login`
```json
Body: { "email": "s@example.com", "password": "secret" }
Response: { "token": "...", "user": { ... } }
```

### GET `/auth/me`  🔒
```json
Response: { "user": { "id", "name", "email", "plan", "credits", "niche" } }
```

### PATCH `/auth/me`  🔒
```json
Body: { "name": "New Name", "niche": "Finance" }
```

---

## 📊 DASHBOARD

### GET `/dashboard/stats`  🔒
```json
Response: {
  "stats": {
    "totalReach": 1240000,
    "reachChange": "+12.4%",
    "engagementRate": 5.8,
    "engagementChange": "+2.1%",
    "viralityScore": 78,
    "viralityStatus": "Steady growth",
    "totalContentPieces": 12,
    "upcomingEvents": 5
  },
  "weeklyGrowth": [{ "day": "Tue", "reach": 120000, "engagement": 5.2 }],
  "platformDistribution": [{ "platform": "Instagram", "percentage": 40, "color": "..." }],
  "recentHighImpactContent": [...]
}
```

### GET `/dashboard/notifications`  🔒

---

## ✍️ CONTENT GENERATOR

### POST `/content/generate`  🔒
```json
Body: {
  "topic": "How AI is changing software development",
  "platform": "LinkedIn",         // Instagram | LinkedIn | Twitter/X | YouTube | Threads
  "niche": "Tech",
  "format": "Post",               // Post | Reel | Thread | Carousel | Short | Script
  "tone": "professional",
  "audience": "developers and CTOs"
}
Response: {
  "id": "uuid",
  "title": "...",
  "hook": "...",
  "body": "...",
  "cta": "...",
  "hashtags": ["#AI", "#Tech"],
  "alt_hooks": ["...", "..."],
  "posting_tips": "...",
  "virality_score": 82,
  "virality_reasons": ["..."],
  "improvements": ["..."]
}
```

### POST `/content/predict-virality`  🔒
```json
Body: { "content": "Your post text...", "platform": "Instagram", "niche": "Tech" }
Response: {
  "virality_score": 74,
  "engagement_prediction": { "likes": "1K-5K", "comments": "50-200" },
  "strengths": [...],
  "weaknesses": [...],
  "improvements": [...],
  "rewritten_hook": "...",
  "best_posting_time": "Tuesday 7-9 PM",
  "algorithm_signals": { "hook_strength": 8, "retention_potential": 7 }
}
```

### POST `/content/seo-keywords`  🔒
```json
Body: { "topic": "AI tools for business", "platform": "YouTube", "niche": "Tech" }
```

### GET `/content?platform=Instagram&status=draft&limit=20&offset=0`  🔒
### GET `/content/:id`  🔒
### PATCH `/content/:id`  🔒
### DELETE `/content/:id`  🔒

---

## 🔥 TREND LAB

### GET `/trends/analyze?niche=Tech&platforms=Instagram,YouTube`  🔒
```json
Response: {
  "trends": [
    {
      "platform": "Twitter/X",
      "hashtag": "#AIRevolution",
      "topic": "AI Revolution",
      "velocity": "Viral",
      "impressions_24h": "1.2M",
      "content_angle": "The hidden cost of AI adoption",
      "why_trending": "..."
    }
  ],
  "global_pulse": {
    "content_strategy_shift": "Video-First",
    "audience_attention_span": "7.8s",
    "algorithm_primary_signal": "Save Ratio",
    "save_ratio_importance": "high"
  },
  "niche_insight": {
    "hook_type": "Self-Improvement",
    "platform_winning": "Instagram Reels",
    "weekly_trend": "...",
    "recommendation": "..."
  }
}
```

### GET `/trends/hashtags?niche=Tech&platform=Instagram`  🔒

### POST `/trends/draft-from-trend`  🔒
```json
Body: { "topic": "AI Revolution", "platform": "LinkedIn", "angle": "The hidden cost of AI adoption" }
```

---

## 📅 CONTENT CALENDAR

### GET `/calendar?start=2024-04-01&end=2024-04-30`  🔒
### POST `/calendar`  🔒
```json
Body: {
  "title": "AI Trends Post",
  "platform": "LinkedIn",
  "format": "Post",
  "status": "scheduled",
  "scheduled_at": "2024-04-08T19:00:00.000Z",
  "note": "Include latest GPT-5 announcement"
}
```

### POST `/calendar/ai-generate-week`  🔒
```json
Body: {
  "niche": "Tech",
  "platforms": ["Instagram", "LinkedIn", "Twitter/X", "YouTube"],
  "goal": "Viral Growth",
  "week_start": "2024-04-08"
}
Response: {
  "entries": [],
  "optimization_tip": "Your Tuesday 7 PM slot has highest engagement in your niche",
  "gap_detected": "Friday evening"
}
```

### PATCH `/calendar/:id`  🔒
### DELETE `/calendar/:id`  🔒

---

## 🎯 STRATEGY HUB

### POST `/strategy/generate`  🔒
```json
Body: { "niche": "Tech", "goal": "Viral Growth" }
Response: {
  "id": "uuid",
  "niche_analysis": "...",
  "competitor_gaps": ["...", "...", "..."],
  "winning_angles": ["...", "...", "..."],
  "growth_roadmap": [
    { "week": "Week 1", "focus": "Hook Optimization & A/B Testing", "tasks": [] }
  ],
  "content_pillars": [
    { "name": "Daily AI Ops", "platform": "Instagram/Reels", "frequency": "3x/week" }
  ],
  "platform_distribution": { "primary": "Instagram", "secondary": "LinkedIn", "repurposing_map": "..." },
  "best_posting_times": { "Instagram": "Tue/Thu 7-9 PM" },
  "unfair_advantage": "..."
}
```

### GET `/strategy`  🔒  (list saved blueprints)
### GET `/strategy/:id`  🔒
### DELETE `/strategy/:id`  🔒

---

## 📈 ANALYTICS

### GET `/analytics/overview`  🔒
### GET `/analytics/content/:id`  🔒
### GET `/analytics/best-times`  🔒

---

## ⚡ WEBSOCKET EVENTS (Socket.io)

Connect to: `ws://localhost:3001`

**Client → Server:**
- `subscribe:trends` (niche: string) — subscribe to live trend updates

**Server → Client:**
- `trend:update` — fires every 30 min with fresh trend data
- `schedule:reminder` — fires 1h before a scheduled post
