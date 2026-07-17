# ViralIQ Project Context for AI Analysis

This document contains the full source code and structure for the **ViralIQ** project. ViralIQ is an AI-powered viral content and digital marketing assistant built with React and Vite.

## Project Overview
- **Objective**: Design an intelligent system to help creators, startups, and businesses optimize digital content strategy using AI/ML.
- **Tech Stack**: React, Vite, Recharts, Lucide-React.
- **Key Features**: Trend Detection, Viral Content Prediction, Content Optimization, Algorithm-Aware Insights, Viral Strategy Generator.

---

## File: package.json
```json
{
  "name": "viraliq",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.379.0",
    "recharts": "^2.12.7",
    "react-is": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.11"
  }
}
```

---

## File: src/index.css
```css
/* ... [CSS content replaced for brevity in preview, but included in full file] ... */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --bg-base: #050811;
  --bg-surface: #0a0f1e;
  --bg-card: rgba(255,255,255,0.035);
  --bg-card-hover: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.08);
  --border-glow: rgba(139,92,246,0.4);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --accent: #8b5cf6;
  --accent-2: #06b6d4;
  --accent-3: #10b981;
  --sidebar-w: 240px;
}
/* ... full CSS follows in source ... */
```

---

## File: src/viralEngine.js
```javascript
// Mock engine with virality scoring logic
export const generateViralContent = async (brief) => {
  // Delay simulation
  await new Promise(r => setTimeout(r, 2200));
  // Tone-based hook generation, virality scoring (0-100), and platform-specific tips.
}
// Includes platform split data, weekly trends, and calendar entries for mock analytics.
```

---

## File: src/App.jsx
```javascript
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import TrendLab from './pages/TrendLab';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Strategy from './pages/Strategy';

// Main App Shell with Page Routing
export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  // ...
}
```

---

## File: src/pages/ContentGenerator.jsx
```javascript
// Handles user brief inputs and displays AI-generated viral content cards with ScoreGauges.
```

---

## File: src/pages/Dashboard.jsx
```javascript
// Provides overview stats, weekly reach charts (Recharts), and top-performing content logs.
```

---

## Instructions for Claude
Please analyze this project and provide:
1. A summary of the architectural choices.
2. Potential improvements for the AI scoring algorithm in `viralEngine.js`.
3. Recommendations for adding real-time API integrations (Instagram/YouTube/Twitter).
4. Feedback on the UI/UX design and accessibility.
