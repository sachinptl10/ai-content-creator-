# ViralIQ Full Project Context for Claude Analysis

This document contains the COMPLETE source code for the **ViralIQ** project. 
Upload this file to Claude to get a full analysis, security audit, or help with further development.

---

## 1. Project Configuration (package.json)
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

## 2. Main Entry Points (src/main.jsx)
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 3. Core Shell (src/App.jsx)
```javascript
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import TrendLab from './pages/TrendLab';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Strategy from './pages/Strategy';

const PAGE_META = {
  dashboard:  { title: 'Dashboard',          sub: 'Your real-time virality command center',         icon: '⚡' },
  generator:  { title: 'Content Generator',  sub: 'AI-powered viral content for every platform',    icon: '✨' },
  trends:     { title: 'Trend Lab',           sub: 'Live trending hashtags, audio & keyword signals', icon: '🔥' },
  analytics:  { title: 'Analytics',           sub: 'Deep-dive into performance & audience data',     icon: '📊' },
  calendar:   { title: 'Content Calendar',    sub: 'Plan and schedule your 7-day content sprint',   icon: '📅' },
  strategy:   { title: 'Strategy Hub',        sub: 'Platform-specific playbooks & repurposing maps', icon: '🎯' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const meta = PAGE_META[activePage];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':  return <Dashboard setActivePage={setActivePage} />;
      case 'generator':  return <ContentGenerator />;
      case 'trends':     return <TrendLab />;
      case 'analytics':  return <Analytics />;
      case 'calendar':   return <Calendar />;
      case 'strategy':   return <Strategy />;
      default:           return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="shell">
      <Sidebar active={activePage} setActive={setActivePage} />

      <div className="main">
        <header className="topbar">
          <div className="topbar-title">
            <h2>{meta.icon} {meta.title}</h2>
            <p>{meta.sub}</p>
          </div>
          <div className="topbar-actions">
            <div className="live-badge">
              <div className="status-dot"></div>
              Live Data
            </div>
            <div className="icon-btn" title="Notifications">🔔</div>
            <div className="icon-btn" title="Settings">⚙️</div>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justify={center},
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer'
            }}>U</div>
          </div>
        </header>

        <div key={activePage} style={{ flex: 1, overflow: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Business Logic (src/viralEngine.js)
```javascript
// ViralIQ Mock AI Engine — implements all ViralIQ system prompt logic

const TRENDS = {
  Instagram: ['#ReelsViral', '#AIContent', '#TrendAlert2026', '#CreatorEconomy', '#VisualStorytelling'],
  'Twitter/X': ['#HotTake', '#AITech', '#FounderLife', '#BuildInPublic', '#ThreadAlert'],
  LinkedIn: ['#GrowthHacking', '#StartupLife', '#AIMarketing', '#PersonalBranding', '#B2BContent'],
  YouTube: ['#ShortsViral', '#ContentCreator', '#AlgorithmHacks', '#YouTubeGrowth', '#ViralShort'],
  Facebook: ['#CommunityBuilding', '#SmallBusiness', '#ViralPost', '#Engagement', '#SocialMedia'],
  Threads: ['#ThreadsViral', '#Opinions', '#CreatorTips', '#GenZ', '#HotOpinion'],
};

const HOOKS_BY_TONE = {
  Witty:        (topic, audience) => `I told ${audience} to try ${topic}. They laughed. Then their numbers tripled 😅`,
  Bold:         (topic, audience) => `${topic} is the only thing standing between ${audience} and irrelevance in 2026.`,
  Inspiring:    (topic, audience) => `One year ago, ${audience} had zero traction. Then they discovered ${topic}. Here's the full story.`,
  Friendly:     (topic, audience) => `Hey ${audience} 👋 — quick story about how ${topic} changed everything for me.`,
  Professional: (topic, audience) => `The data is clear: ${audience} leveraging ${topic} see 3x higher engagement. Here's why.`,
  Emotional:    (topic, audience) => `I almost gave up on ${topic}. Until I realized what ${audience} actually needed to hear.`,
  Educational:  (topic, audience) => `Most ${audience} don't know this about ${topic} — and it's costing them reach. 🧵`,
  Controversial:(topic, audience) => `Unpopular opinion: ${topic} is actually holding ${audience} back. And nobody is saying it.`,
};

const PLATFORM_FORMAT_TIPS = {
  Instagram: 'Reel (0:15–0:30) with trending audio. Add 3–5 story slides for retention loop.',
  'Twitter/X': '5–8 tweet thread. First tweet must work as a standalone hook.',
  LinkedIn: 'Document carousel (PDF) with 8–10 slides or long-form text post with line breaks.',
  YouTube: 'Short (under 60s). Hook must land in first 2 seconds. End with strong pattern interrupt.',
  Facebook: 'Native video or image carousel. Community-question angle drives most comments.',
  Threads: 'Single punchy opinion post (under 500 chars). Ask one direct question at the end.',
};

const PLATFORM_TIMES = {
  Instagram: 'Tuesday or Wednesday, 6:30–9:00 PM IST',
  'Twitter/X': 'Monday–Thursday, 9:00–11:00 AM EST',
  LinkedIn: 'Tuesday–Thursday, 8:00–10:00 AM IST',
  YouTube: 'Friday or Saturday, 5:00–8:00 PM local time',
  Facebook: 'Wednesday or Thursday, 1:00–4:00 PM local time',
  Threads: 'Weekdays 12:00–2:00 PM or 8:00–10:00 PM IST',
};

const generateHashtags = (topic, platform) => {
  const base = TRENDS[platform] || [];
  const topicTag = `#${topic.replace(/\s+/g,'').replace(/[^a-zA-Z0-9]/g,'')}`;
  return [topicTag, ...base].slice(0, 8);
};

const scoreContent = (hook, tone, platform) => {
  const hookStrength = tone === 'Bold' || tone === 'Controversial' ? 23 : tone === 'Witty' ? 22 : 20;
  const emotionalTrigger = tone === 'Emotional' || tone === 'Inspiring' ? 23 : tone === 'Witty' ? 21 : 19;
  const trendAlignment = ['Instagram', 'Twitter/X', 'Threads'].includes(platform) ? 22 : 20;
  const ctaClarity = 21;
  const total = hookStrength + emotionalTrigger + trendAlignment + ctaClarity;
  const label = total >= 90 ? 'Exceptional' : total >= 75 ? 'Strong' : total >= 60 ? 'Good' : 'Average';
  return { total, hookStrength, emotionalTrigger, trendAlignment, ctaClarity, label };
};

export const generateViralContent = async (brief) => {
  await new Promise(r => setTimeout(r, 2200));
  const { topic, audience, goals, tone, platforms } = brief;
  const t = topic || 'your product';
  const a = audience || 'creators';

  return {
    session: { topic: t, audience: a, goal: goals, tone, platforms_selected: platforms },
    generated_content: platforms.map(platform => {
      const hook = HOOKS_BY_TONE[tone]?.(t, a) || `Discover how ${t} transforms outcomes for ${a}.`;
      const score = scoreContent(hook, tone, platform);
      return {
        platform,
        hook,
        body: `If you're a ${a} and you're not paying attention to ${t} right now, you're missing one of the biggest opportunities of 2026.\n\nHere's the reality: the top performing creators in your niche are already using these insights to outpace competitors who still rely on gut-feel decisions.\n\nWe've broken down exactly what works, why it works, and how you can implement it in the next 24 hours — without any paid tools.\n\nSave this post. Come back to it. Then drop a 🔥 in the comments so I know you're serious about your growth.`,
        cta: `Comment "${t.split(' ')[0].toUpperCase()}" below and I'll DM you the free strategy guide.`,
        hashtags: generateHashtags(t, platform),
        format_tip: PLATFORM_FORMAT_TIPS[platform] || 'Short-form video recommended.',
        best_post_time: PLATFORM_TIMES[platform] || 'Weekdays 6–9 PM local time',
        virality_score: {
          ...score,
          score_label: `${score.label} — ${score.total >= 80 ? 'above average reach' : 'solid performance'} expected`,
          improvement_tip: `Add a specific number to your hook (e.g. "3x") for a +5 virality boost.`,
        },
      };
    }),
    trending_hashtags: (function() {
      const allPlatforms = platforms.length ? platforms : ['Instagram'];
      const tags = [];
      const seen = new Set();
      allPlatforms.forEach(p => {
        (TRENDS[p] || []).forEach(tag => {
          if (!seen.has(tag)) {
            seen.add(tag);
            tags.push({
              hashtag: tag,
              relevance: `High resonance with ${a} on ${p}`,
              reach_potential: seen.size <= 2 ? 'Viral' : seen.size <= 4 ? 'High' : 'Medium',
              content_angle: `Use ${tag} with a bold opinion about ${t} to ride this wave.`,
            });
          }
        });
      });
      return tags.slice(0, 6);
    })(),
    ai_tip: `Your audience of "${a}" peaks in engagement on ${platforms[0] || 'Instagram'} between 6–9 PM on Tuesday/Wednesday. Pair your ${tone.toLowerCase()} tone with a specific data point or personal failure story in the first sentence — that combo is currently driving 2–3x more saves than generic hooks.`,
  };
};

export const PLATFORM_ICONS = {
  Instagram: '📸',
  'Twitter/X': '𝕏',
  LinkedIn: '💼',
  YouTube: '▶️',
  Facebook: '📘',
  Threads: '🧵',
};

export const mockAnalytics = {
  totalReach: '4.2M',
  engagementRate: '8.7%',
  avgViralityScore: 81,
  contentPieces: 247,
  weeklyData: [
    { day: 'Mon', reach: 420, engagement: 38, virality: 72 },
    { day: 'Tue', reach: 780, engagement: 65, virality: 84 },
    { day: 'Wed', reach: 940, engagement: 72, virality: 88 },
    { day: 'Thu', reach: 610, engagement: 50, virality: 77 },
    { day: 'Fri', reach: 850, engagement: 68, virality: 82 },
    { day: 'Sat', reach: 1100, engagement: 89, virality: 91 },
    { day: 'Sun', reach: 730, engagement: 61, virality: 79 },
  ],
  platformSplit: [
    { name: 'Instagram', value: 38, color: '#e879f9' },
    { name: 'LinkedIn', value: 24, color: '#60a5fa' },
    { name: 'Twitter/X', value: 20, color: '#34d399' },
    { name: 'YouTube', value: 12, color: '#fb923c' },
    { name: 'Others', value: 6, color: '#94a3b8' },
  ],
  topContent: [
    { title: 'AI replacing jobs thread', platform: 'Twitter/X', reach: '280K', score: 92, change: '+14%' },
    { title: '5 mistakes every creator makes', platform: 'Instagram', reach: '210K', score: 88, change: '+9%' },
    { title: 'How I 10x\'d my LinkedIn', platform: 'LinkedIn', reach: '190K', score: 86, change: '+21%' },
    { title: 'The truth about viral content', platform: 'Threads', reach: '150K', score: 83, change: '+5%' },
    { title: 'Morning routine that doubled results', platform: 'YouTube', reach: '130K', score: 80, change: '+12%' },
  ],
};

export const calendarData = [
  { day: 'Mon', date: 'Apr 7', platform: 'LinkedIn', topic: 'AI productivity tips', format: 'Carousel', tone: 'Professional', hook: 'I saved 3 hours/day. Here\'s how.', time: '9:00 AM' },
  { day: 'Tue', date: 'Apr 8', platform: 'Instagram', topic: 'Behind the scenes', format: 'Reel', tone: 'Friendly', hook: 'Nobody shows you this part...', time: '7:00 PM' },
  { day: 'Wed', date: 'Apr 9', platform: 'Twitter/X', topic: 'Controversial take', format: 'Thread', tone: 'Bold', hook: 'Most creators are wasting time.', time: '11:00 AM' },
  { day: 'Thu', date: 'Apr 10', platform: 'YouTube', topic: 'Tutorial walkthrough', format: 'Short', tone: 'Educational', hook: 'Do this in 60 seconds.', time: '6:00 PM' },
  { day: 'Fri', date: 'Apr 11', platform: 'Instagram', topic: 'Motivational story', format: 'Post', tone: 'Inspiring', hook: 'One year ago I had 0 followers.', time: '8:00 PM' },
  { day: 'Sat', date: 'Apr 12', platform: 'Threads', topic: 'Hot take opinion', format: 'Post', tone: 'Controversial', hook: 'Unpopular: Consistency is overrated.', time: '12:00 PM' },
  { day: 'Sun', date: 'Apr 13', platform: 'LinkedIn', topic: 'Week in review', format: 'Text Post', tone: 'Emotional', hook: 'This week nearly broke me.', time: '6:00 PM' },
];
```

---

## 5. Main Component: Sidebar (src/components/Sidebar.jsx)
```javascript
import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡', section: 'main' },
  { id: 'generator', label: 'Content Generator', icon: '✨', section: 'main', badge: 'AI' },
  { id: 'trends', label: 'Trend Lab', icon: '🔥', section: 'main' },
  { id: 'analytics', label: 'Analytics', icon: '📊', section: 'insights' },
  { id: 'calendar', label: 'Content Calendar', icon: '📅', section: 'insights' },
  { id: 'strategy', label: 'Strategy Hub', icon: '🎯', section: 'insights' },
];

export default function Sidebar({ active, setActive }) {
  const mainItems = navItems.filter(n => n.section === 'main');
  const insightItems = navItems.filter(n => n.section === 'insights');

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div>
          <div className="logo-text">ViralIQ</div>
          <div className="logo-badge">AI POWERED</div>
        </div>
      </div>
      <nav className="nav-section">
        <div className="nav-label">Platform</div>
        {mainItems.map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
        <div className="nav-label">Insights</div>
        {insightItems.map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <div className="user-name">Creator Pro</div>
            <div className="user-plan">Pro Plan · Active</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

---

## 6. Styles (src/index.css)
Note: Includes full design system for ViralIQ.
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --bg-base: #050811;
  --bg-surface: #0a0f1e;
  --bg-card: rgba(255,255,255,0.035);
  --bg-card-hover: rgba(255,255,255,0.06);
  --border: rgba(255,255,255,0.08);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #8b5cf6;
  --accent-2: #06b6d4;
  --accent-3: #10b981;
}

body { font-family: 'Inter', sans-serif; background: var(--bg-base); color: var(--text-primary); }
.glass-panel { background: var(--bg-card); backdrop-filter: blur(16px); border: 1px solid var(--border); }
/* ... [rest of the 500+ lines of CSS] ... */
```
