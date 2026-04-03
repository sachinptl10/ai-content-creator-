import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PieChart, Pie, Cell
} from 'recharts';
import { mockAnalytics, PLATFORM_ICONS } from '../viralEngine';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0d1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const radarData = [
  { subject: 'Hook Power', A: 88 }, { subject: 'Emotion', A: 74 },
  { subject: 'Trending', A: 91 }, { subject: 'CTA', A: 82 },
  { subject: 'Format', A: 79 }, { subject: 'Timing', A: 86 },
];

const engagementByFormat = [
  { format: 'Reel', rate: 12.4 }, { format: 'Carousel', rate: 9.8 },
  { format: 'Thread', rate: 8.2 }, { format: 'Story', rate: 6.5 },
  { format: 'Short', rate: 11.1 }, { format: 'Post', rate: 4.3 },
];

const audienceData = [
  { age: '18–24', pct: 38 }, { age: '25–34', pct: 34 },
  { age: '35–44', pct: 16 }, { age: '45+', pct: 12 },
];

export default function Analytics() {
  const [range, setRange] = useState('7d');
  const { weeklyData, platformSplit, topContent } = mockAnalytics;

  return (
    <div className="page-content animate-in">
      {/* Range Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['7d', '30d', '90d', '1y'].map(r => (
          <button key={r} className={`btn btn-sm ${range === r ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRange(r)}>{r}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">⬇️ Export CSV</button>
          <button className="btn btn-secondary btn-sm">📊 Full Report</button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { l: 'Total Impressions', v: '14.2M', c: '+24%', col: '#8b5cf6' },
          { l: 'Profile Visits', v: '318K', c: '+11%', col: '#06b6d4' },
          { l: 'Follower Growth', v: '+4,820', c: '+18%', col: '#10b981' },
          { l: 'Avg. Watch Time', v: '38s', c: '+7s', col: '#f97316' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ borderTop: `2px solid ${s.col}` }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.col }}>{s.v}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#34d399', marginTop: 4 }}>▲ {s.c} vs last period</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Reach + Engagement */}
        <div className="card">
          <div className="section-title"><span>📈 Reach & Engagement</span>
            <span className="tag tag-purple">Weekly</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="reach" name="Reach" stroke="#8b5cf6" fill="url(#g1)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#10b981" fill="url(#g2)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Virality Score Trend */}
        <div className="card">
          <div className="section-title"><span>⚡ Virality Score Trend</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="virality" name="Virality Score" fill="url(#barGrad)" radius={[4, 4, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${250 + i * 8}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {/* Engagement by Format */}
        <div className="card">
          <div className="section-title"><span>📐 Engagement by Format</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={engagementByFormat} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="format" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Eng. Rate %" radius={[0, 4, 4, 0]}>
                {engagementByFormat.map((_, i) => (
                  <Cell key={i} fill={['#8b5cf6','#06b6d4','#10b981','#f97316','#ec4899','#6366f1'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card">
          <div className="section-title"><span>🎯 Content Radar</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={65}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#64748b' }} />
              <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Age */}
        <div className="card">
          <div className="section-title"><span>👥 Audience Demographics</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {audienceData.map((a, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{a.age}</span>
                  <span style={{ fontWeight: 700 }}>{a.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${a.pct}%`, height: '100%', background: `hsl(${250 + i * 30}, 70%, 60%)`, borderRadius: 6, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ l: 'Top City', v: 'Mumbai' }, { l: 'Top Country', v: 'India' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-2)' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content Table */}
      <div className="card">
        <div className="section-title"><span>🏆 Content Performance Log</span></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Content Title</th><th>Platform</th>
              <th>Reach</th><th>Virality Score</th><th>Change</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topContent.map((c, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</td>
                <td style={{ fontWeight: 500, maxWidth: 200 }}>{c.title}</td>
                <td><span className="tag tag-purple">{PLATFORM_ICONS[c.platform]} {c.platform}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--accent-2)' }}>{c.reach}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                      <div style={{ width: `${c.score}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{c.score}</span>
                  </div>
                </td>
                <td><span className="tag tag-green">{c.change}</span></td>
                <td><span className="tag tag-cyan">✅ Live</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
