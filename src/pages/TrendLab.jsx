import React, { useState, useEffect } from 'react';
import { PLATFORM_ICONS } from '../viralEngine';

const TREND_DATA = [
  { rank: 1, hashtag: '#AIContentCreator', platform: 'Instagram', volume: '2.4M', reach: 'Viral 🔥', change: '+340%', angle: 'Show how AI generated your best performing post — screenshot proof works best here.', risk: false },
  { rank: 2, hashtag: '#BuildInPublic', platform: 'Twitter/X', volume: '1.8M', reach: 'Viral 🔥', change: '+210%', angle: 'Share a raw screenshot of your analytics with zero filters. Authenticity = engagement.', risk: false },
  { rank: 3, hashtag: '#CreatorEconomy2026', platform: 'LinkedIn', volume: '980K', reach: 'High', change: '+120%', angle: 'Write about how creator tools are replacing traditional marketing teams.', risk: false },
  { rank: 4, hashtag: '#ReelsTrend', platform: 'Instagram', volume: '5.2M', reach: 'Viral 🔥', change: '+89%', angle: 'Use a trending audio and overlay your key stat. Best format: text-on-reel with face cam.', risk: false },
  { rank: 5, hashtag: '#AIMarketing', platform: 'LinkedIn', volume: '1.2M', reach: 'High', change: '+165%', angle: 'Post a contrarian take: 1 thing AI still cannot do in marketing.', risk: false },
  { rank: 6, hashtag: '#ViralHacks', platform: 'Threads', volume: '670K', reach: 'Medium', change: '+44%', angle: 'List 3 non-obvious hacks in a casual, opinion-style thread.', risk: false },
  { rank: 7, hashtag: '#TechStartup', platform: 'Twitter/X', volume: '3.1M', reach: 'High', change: '+30%', angle: 'Compare two big tools head-to-head in a spicy take.', risk: false },
  { rank: 8, hashtag: '#ContentStrategy', platform: 'LinkedIn', volume: '890K', reach: 'Medium', change: '+22%', angle: 'Post your exact posting schedule for the last 30 days with results.', risk: false },
  { rank: 9, hashtag: '#NanoInfluencer', platform: 'Instagram', volume: '440K', reach: 'Medium', change: '+18%', angle: 'Show engagement rate comparison: nano vs mega. The data surprises most people.', risk: false },
  { rank: 10, hashtag: '#CryptoAI', platform: 'Twitter/X', volume: '780K', reach: 'Low ⚠️', change: '-12%', angle: 'Use with extreme caution. This trend is fading and audience trust is at all-time low.', risk: true },
];

const KEYWORD_SUGGESTIONS = {
  Instagram: ['viral reels tips', 'instagram algorithm 2026', 'content creator growth', 'reel hook ideas', 'aesthetic content'],
  'Twitter/X': ['building in public', 'startup lessons', 'growth hacking X', 'thread virality', 'founder mindset'],
  LinkedIn: ['B2B content strategy', 'personal branding 2026', 'LinkedIn algorithm tips', 'thought leadership', 'career growth AI'],
  YouTube: ['YouTube Shorts algorithm', 'hook formula YouTube', 'subscriber growth tips', 'video SEO 2026', 'watch time hacks'],
};

const AUDIO_TRENDS = [
  { name: 'Lo-fi Tech Beats', platform: 'Instagram', uses: '4.2M', trend: '↑ Rising' },
  { name: 'Dramatic Reveal Sound', platform: 'Instagram', uses: '2.8M', trend: '↑ Viral' },
  { name: 'Inspiring Piano Loop', platform: 'YouTube', uses: '1.9M', trend: '↑ Rising' },
  { name: 'Robot Voice Effect', platform: 'Threads', uses: '800K', trend: '→ Stable' },
];

const reachColor = (r) => {
  if (r.includes('Viral')) return 'tag-pink';
  if (r.includes('High')) return 'tag-green';
  if (r.includes('Medium')) return 'tag-cyan';
  return 'tag-orange';
};

export default function TrendLab() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => { setAnimIn(true); }, []);

  const platforms = ['All', 'Instagram', 'Twitter/X', 'LinkedIn', 'Threads', 'YouTube'];
  const filtered = TREND_DATA
    .filter(t => filter === 'All' || t.platform === filter)
    .filter(t => !search || t.hashtag.toLowerCase().includes(search.toLowerCase()));

  const copyTag = (tag, i) => {
    navigator.clipboard.writeText(tag);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="page-content animate-in">
      {/* Header Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Trending Hashtags', value: '10', icon: '🏷️', color: '#8b5cf6' },
          { label: 'Viral Opportunities', value: '4', icon: '🔥', color: '#ec4899' },
          { label: 'Rising Trends', value: '7', icon: '📈', color: '#10b981' },
          { label: 'Fading Trends', value: '1', icon: '⚠️', color: '#f97316' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2-1" style={{ gap: 24, alignItems: 'start' }}>
        {/* Main Trends Table */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title"><span>🔥 Live Trending Hashtags</span></div>
            {/* Filter + Search */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              {platforms.map(p => (
                <div key={p} className={`chip ${filter === p ? 'active' : ''}`}
                  style={{ fontSize: 12, padding: '5px 12px' }}
                  onClick={() => setFilter(p)}>
                  {p !== 'All' && <span>{PLATFORM_ICONS[p]}</span>} {p}
                </div>
              ))}
              <input
                className="form-input"
                placeholder="Search hashtag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 140 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((t, i) => (
                <div key={i} className="trend-card"
                  style={{ borderColor: t.risk ? 'rgba(239,68,68,0.25)' : 'var(--border)' }}>
                  <div className="trend-rank" style={{ color: t.rank <= 3 ? '#a78bfa' : 'var(--text-muted)' }}>
                    {t.rank <= 3 ? '🏆' : `#${t.rank}`}
                  </div>
                  <div className="trend-info">
                    <div className="trend-tag">{t.hashtag}</div>
                    <div className="trend-meta">
                      <span>{PLATFORM_ICONS[t.platform]} {t.platform}</span>
                      <span style={{ margin: '0 8px', color: 'var(--border)' }}>|</span>
                      <span>{t.volume} posts</span>
                      {t.risk && <span style={{ color: '#f87171', marginLeft: 8 }}>⚠️ Fading</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                      💡 {t.angle}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span className={`tag ${reachColor(t.reach)}`}>{t.reach}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.change.startsWith('+') ? '#34d399' : '#f87171' }}>
                      {t.change}
                    </span>
                    <button className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '4px 8px' }}
                      onClick={() => copyTag(t.hashtag, i)}>
                      {copied === i ? '✅' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-state-icon">🔍</div>
                  <div className="empty-state-title">No trends found</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Trending Audio */}
          <div className="card card-glow-cyan">
            <div className="section-title"><span>🎵 Trending Audio</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AUDIO_TRENDS.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)'
                }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🎵</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.platform} • {a.uses} uses</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: a.trend.includes('Viral') ? '#f472b6' : a.trend.includes('Rising') ? '#34d399' : '#94a3b8' }}>
                    {a.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Keywords */}
          <div className="card card-glow-purple">
            <div className="section-title"><span>🔍 SEO Keywords</span></div>
            {Object.entries(KEYWORD_SUGGESTIONS).slice(0, 3).map(([platform, keys]) => (
              <div key={platform} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {PLATFORM_ICONS[platform]} {platform}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {keys.slice(0, 3).map((k, i) => (
                    <span key={i} style={{ fontSize: 11, background: 'rgba(6,182,212,0.08)', color: '#22d3ee', padding: '3px 8px', borderRadius: 12, border: '1px solid rgba(6,182,212,0.2)' }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI Content Angle Tip */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 12, padding: 16
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>⚡ TREND INSIGHT</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              The #AIContentCreator trend is currently peaking with a 340% weekly surge on Instagram. 
              Post between 7–9 PM on Tuesday or Wednesday for the highest chance of hitting the Explore page.
              Use a before/after format to maximize saves (saves = algorithm priority signal).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
