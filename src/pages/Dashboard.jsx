import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, PieChart, Pie, Cell } from 'recharts';
import { mockAnalytics, PLATFORM_ICONS } from '../viralEngine';

const StatCard = ({ label, value, change, icon, colorClass, glowClass }) => (
  <div className={`card stat-card ${glowClass}`}>
    <div className="stat-header">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ marginTop: 8 }}>{value}</div>
      </div>
      <div className="stat-icon" style={{
        background: colorClass === 'purple' ? 'rgba(139,92,246,0.15)' :
                    colorClass === 'cyan' ? 'rgba(6,182,212,0.15)' :
                    colorClass === 'green' ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)',
        fontSize: 20
      }}>
        {icon}
      </div>
    </div>
    <div className={`stat-change ${change.startsWith('+') ? 'up' : 'down'}`}>
      {change.startsWith('+') ? '▲' : '▼'} {change} vs last week
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d1120', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '10px 14px', fontSize: 12
      }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}{p.name === 'virality' ? '' : 'K'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ setActivePage }) {
  const { weeklyData, platformSplit, topContent } = mockAnalytics;

  return (
    <div className="page-content animate-in">
      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Reach" value="4.2M" change="+18%" icon="🚀" colorClass="purple" glowClass="card-glow-purple" />
        <StatCard label="Avg. Virality Score" value="81/100" change="+6pts" icon="⚡" colorClass="cyan" glowClass="card-glow-cyan" />
        <StatCard label="Engagement Rate" value="8.7%" change="+2.1%" icon="💬" colorClass="green" glowClass="card-glow-green" />
        <StatCard label="Content Pieces" value="247" change="+23" icon="📝" colorClass="orange" glowClass="card-glow-pink" />
      </div>

      {/* Charts Row */}
      <div className="grid-2-1" style={{ marginBottom: 24 }}>
        {/* Area Chart */}
        <div className="card">
          <div className="section-title">
            <span>Weekly Performance</span>
            <span className="tag tag-purple">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reach" name="reach" stroke="#8b5cf6" fill="url(#reachGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="engagement" name="engagement" stroke="#06b6d4" fill="url(#engGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 3, background: '#8b5cf6', borderRadius: 2 }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Reach (K)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 3, background: '#06b6d4', borderRadius: 2 }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Engagement (K)</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="section-title"><span>Platform Split</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <PieChart width={140} height={140}>
              <Pie data={platformSplit} cx={65} cy={65} innerRadius={44} outerRadius={65}
                dataKey="value" paddingAngle={3} strokeWidth={0}>
                {platformSplit.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {platformSplit.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }}></div>
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{p.name}</span>
                  <span style={{ fontWeight: 700, color: p.color }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Content Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">
          <span>🏆 Top Performing Content</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('analytics')}>View All</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Platform</th>
              <th>Reach</th>
              <th>Virality Score</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {topContent.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{item.title}</td>
                <td>
                  <span className="tag tag-purple" style={{ fontSize: 11 }}>
                    {PLATFORM_ICONS[item.platform]} {item.platform}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--accent-2)' }}>{item.reach}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, width: 28 }}>{item.score}</span>
                  </div>
                </td>
                <td><span className="tag tag-green">{item.change}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="grid-3">
        {[
          { icon: '✨', label: 'Generate Content', desc: 'AI-powered viral content for any platform', color: '#8b5cf6', page: 'generator' },
          { icon: '🔥', label: 'Explore Trends', desc: 'Real-time trending topics & hashtags', color: '#06b6d4', page: 'trends' },
          { icon: '📅', label: 'Plan Calendar', desc: 'Schedule a 7-day content sprint', color: '#10b981', page: 'calendar' },
        ].map((a, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setActivePage(a.page)}
            onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.desc}</div>
            <div style={{ color: a.color, fontSize: 12, fontWeight: 600, marginTop: 12 }}>Get started →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
