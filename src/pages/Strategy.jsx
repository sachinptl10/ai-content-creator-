import React, { useState } from 'react';
import { PLATFORM_ICONS } from '../viralEngine';

const STRATEGIES = [
  {
    platform: 'Instagram',
    score: 92,
    audience: 'Gen-Z & Millennials (18–34)',
    primary: 'Reels with trending audio',
    posting: '4–5x per week',
    bestTimes: 'Tue/Wed 6:30–9 PM IST',
    hooks: ['POV: You discovered…', 'Stop scrolling if you…', 'This changed everything for me'],
    crossPost: ['Threads (repurpose caption)', 'YouTube Short (same video)'],
    tip: 'Save-to-watch-later ratio is the #1 Instagram signal right now. Build content specifically designed to be saved.',
    color: '#e879f9',
  },
  {
    platform: 'Twitter/X',
    score: 87,
    audience: 'Founders, Creators, Tech (22–40)',
    primary: '5–8 tweet threads',
    posting: '2–3x per day',
    bestTimes: 'Mon–Thu 9–11 AM EST',
    hooks: ['Unpopular opinion:', 'I spent 90 days doing X. Here\'s what I learned:', 'Most people get this wrong:'],
    crossPost: ['LinkedIn (expand into article)', 'Newsletter (as anchor post)'],
    tip: 'Replies to large accounts in your niche get you free exposure. Aim for 5 strategic replies per day.',
    color: '#34d399',
  },
  {
    platform: 'LinkedIn',
    score: 84,
    audience: 'Professionals & B2B Decision Makers',
    primary: 'Story-driven text posts + carousels',
    posting: '3–4x per week',
    bestTimes: 'Tue–Thu 8–10 AM IST',
    hooks: ['I failed. Here\'s what I learned:', '3 years ago I was…', 'The data doesn\'t lie:'],
    crossPost: ['Twitter/X (condensed thread)', 'Instagram (carousel visual)'],
    tip: 'End every LinkedIn post with a "What would you do?" question. Comments are the strongest engagement signal on this platform.',
    color: '#60a5fa',
  },
];

const DISTRIBUTION_MAP = [
  { from: 'Long-form Blog', to: ['LinkedIn Article', 'Twitter Thread', 'Instagram Carousel'] },
  { from: 'YouTube Video', to: ['YouTube Short', 'Instagram Reel', 'Twitter Clip'] },
  { from: 'Podcast Episode', to: ['Audiogram Reel', 'Twitter Quote', 'LinkedIn Post'] },
];

export default function Strategy() {
  const [active, setActive] = useState(0);

  const s = STRATEGIES[active];

  return (
    <div className="page-content animate-in">
      {/* Platform Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {STRATEGIES.map((st, i) => (
          <button key={i}
            className={`btn btn-sm ${active === i ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActive(i)}>
            {PLATFORM_ICONS[st.platform]} {st.platform}
          </button>
        ))}
      </div>

      {/* Strategy Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Left: Overview */}
        <div className="card" style={{ borderTop: `3px solid ${s.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color, marginBottom: 4 }}>
                {PLATFORM_ICONS[s.platform]} {s.platform} Strategy
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.audience}</div>
            </div>
            <div style={{ textAlign: 'center', background: `${s.color}18`, border: `1px solid ${s.color}44`, borderRadius: 10, padding: '8px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color }}>{s.score}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Strategy Score</div>
            </div>
          </div>

          {[
            { l: '🎬 Primary Format', v: s.primary },
            { l: '📅 Posting Frequency', v: s.posting },
            { l: '⏰ Best Times', v: s.bestTimes },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{f.l}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{f.v}</div>
            </div>
          ))}
        </div>

        {/* Right: Hooks + Cross-Post */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-title"><span>🎣 Proven Hook Formulas</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.hooks.map((h, i) => (
                <div key={i} style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${s.color}`,
                  borderRadius: '0 8px 8px 0',
                  fontSize: 13, fontWeight: 500,
                }}>
                  "{h}"
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-title"><span>🔄 Cross-Platform Repurpose</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.crossPost.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ color: s.color }}>→</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${s.color}18, transparent)`,
            border: `1px solid ${s.color}44`,
            borderRadius: 10, padding: 16
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>💡 Algorithm Tip</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{s.tip}</div>
          </div>
        </div>
      </div>

      {/* Content Repurposing Map */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title"><span>🗺️ Content Repurposing Map</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {DISTRIBUTION_MAP.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                padding: '8px 16px', background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8,
                fontSize: 13, fontWeight: 700, color: '#a78bfa', whiteSpace: 'nowrap', minWidth: 160
              }}>{row.from}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 18, flexShrink: 0 }}>→</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {row.to.map((t, j) => (
                  <span key={j} className="tag tag-cyan" style={{ fontSize: 12 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Platform Scores */}
      <div className="grid-3">
        {STRATEGIES.map((st, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', borderTop: `2px solid ${st.color}` }}
            onClick={() => setActive(i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: st.color }}>
                {PLATFORM_ICONS[st.platform]} {st.platform}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk', color: st.color }}>{st.score}</div>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${st.score}%`, height: '100%', background: `linear-gradient(90deg, ${st.color}, ${st.color}88)`, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{st.primary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
