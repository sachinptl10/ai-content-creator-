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
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div>
          <div className="logo-text">ViralIQ</div>
          <div className="logo-badge">AI POWERED</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav-section">
        <div className="nav-label">Platform</div>
        {mainItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}

        <div className="nav-label">Insights</div>
        {insightItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <div className="user-name">Creator Pro</div>
            <div className="user-plan">Pro Plan · Active</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>⚙️</span>
        </div>
      </div>
    </aside>
  );
}
