import React, { useState } from 'react';
import { calendarData, PLATFORM_ICONS } from '../viralEngine';

const TONE_COLORS = {
  Professional: '#60a5fa', Friendly: '#34d399', Bold: '#f87171',
  Inspiring: '#a78bfa', Educational: '#22d3ee', Controversial: '#fbbf24',
  Emotional: '#f472b6', Witty: '#fb923c',
};

const PLATFORM_COLORS = {
  Instagram: '#e879f9', 'Twitter/X': '#34d399', LinkedIn: '#60a5fa',
  YouTube: '#f87171', Facebook: '#818cf8', Threads: '#fb923c',
};

export default function Calendar() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('week');

  return (
    <div className="page-content animate-in">
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['week', 'list'].map(v => (
            <button key={v} className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView(v)} style={{ textTransform: 'capitalize' }}>
              {v === 'week' ? '📅 Week View' : '📋 List View'}
            </button>
          ))}
        </div>
        <button className="btn btn-gradient btn-sm">+ Add Content</button>
      </div>

      {view === 'week' ? (
        <>
          {/* Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 16 }}>
            {calendarData.map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{d.day}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{d.date.split(' ')[1]}</div>
              </div>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 24 }}>
            {calendarData.map((d, i) => (
              <div key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                style={{
                  background: selected === i ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected === i ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`,
                  borderTop: `3px solid ${PLATFORM_COLORS[d.platform] || '#8b5cf6'}`,
                  borderRadius: 10, padding: 12, cursor: 'pointer', transition: 'all 0.15s', minHeight: 120,
                }}>
                <div style={{ fontSize: 10, color: PLATFORM_COLORS[d.platform], fontWeight: 700, marginBottom: 4 }}>
                  {PLATFORM_ICONS[d.platform]} {d.platform}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.35, marginBottom: 6, color: 'var(--text-primary)' }}>{d.topic}</div>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8,
                  background: `${TONE_COLORS[d.tone]}22`, color: TONE_COLORS[d.tone], border: `1px solid ${TONE_COLORS[d.tone]}44`
                }}>{d.tone}</span>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>⏰ {d.time} • {d.format}</div>
              </div>
            ))}
          </div>

          {/* Expanded detail */}
          {selected !== null && (
            <div className="card card-glow-purple animate-in">
              <div className="section-title">
                <span>📋 Post Details — {calendarData[selected].day}, {calendarData[selected].date}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
              <div className="grid-3" style={{ gap: 20 }}>
                {[
                  { l: 'Platform', v: `${PLATFORM_ICONS[calendarData[selected].platform]} ${calendarData[selected].platform}` },
                  { l: 'Format', v: calendarData[selected].format },
                  { l: 'Tone', v: calendarData[selected].tone },
                  { l: 'Post Time', v: calendarData[selected].time },
                  { l: 'Topic', v: calendarData[selected].topic },
                ].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{f.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{f.v}</div>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>🎣 Hook Idea</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderLeft: '3px solid var(--accent)', borderRadius: '0 8px 8px 0' }}>
                  "{calendarData[selected].hook_idea}"
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* List View */
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Day / Date</th><th>Platform</th><th>Topic</th>
                <th>Format</th><th>Tone</th><th>Hook Idea</th><th>Post Time</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{d.day}, {d.date}</td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, color: PLATFORM_COLORS[d.platform] }}>
                      {PLATFORM_ICONS[d.platform]} {d.platform}
                    </span>
                  </td>
                  <td style={{ maxWidth: 160, fontSize: 12 }}>{d.topic}</td>
                  <td><span className="tag tag-purple" style={{ fontSize: 10 }}>{d.format}</span></td>
                  <td>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 8,
                      background: `${TONE_COLORS[d.tone]}22`, color: TONE_COLORS[d.tone]
                    }}>{d.tone}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: 200 }}>"{d.hook_idea}"</td>
                  <td style={{ fontSize: 12, color: 'var(--accent-2)', fontWeight: 600 }}>{d.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Scheduling Insights */}
      <div className="grid-3" style={{ marginTop: 24 }}>
        {[
          { icon: '📸', title: 'Instagram Peak', desc: 'Tuesday & Wednesday 6:30–9:00 PM IST. Reels get 3x more reach than static posts this window.', col: '#e879f9' },
          { icon: '💼', title: 'LinkedIn Peak', desc: 'Tuesday–Thursday 8–10 AM IST. Text posts with line-breaks outperform carousels on weekends.', col: '#60a5fa' },
          { icon: '𝕏', title: 'Twitter/X Peak', desc: 'Mon–Thu 9–11 AM EST. First tweet in thread must standalone. Threads > single tweets 4:1.', col: '#34d399' },
        ].map((tip, i) => (
          <div key={i} className="card" style={{ borderTop: `2px solid ${tip.col}` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{tip.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: tip.col }}>{tip.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{tip.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
