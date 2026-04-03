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
        {/* Topbar */}
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
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer'
            }}>U</div>
          </div>
        </header>

        {/* Page Content */}
        <div key={activePage} style={{ flex: 1, overflow: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
