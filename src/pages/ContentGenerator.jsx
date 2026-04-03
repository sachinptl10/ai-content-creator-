import React, { useState } from 'react';
import { generateViralContent, PLATFORM_ICONS } from '../viralEngine';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'YouTube', 'Facebook', 'Threads'];
const TONES = ['Witty', 'Bold', 'Inspiring', 'Friendly', 'Professional', 'Emotional', 'Educational', 'Controversial'];

function ScoreGauge({ score }) {
  const r = 54;
  const circ = Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? '#10b981' : score >= 65 ? '#f97316' : '#ef4444';

  return (
    <div className="gauge-wrap">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 14 76 A 56 56 0 0 1 126 76"
          fill="none" stroke="url(#arcGrad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
        <text x="70" y="72" textAnchor="middle" fill="white" fontSize="22" fontWeight="800"
          fontFamily="Space Grotesk, sans-serif">{score}</text>
      </svg>
      <span style={{ fontSize: 12, color: color, fontWeight: 700 }}>
        {score >= 80 ? '🔥 Strong' : score >= 65 ? '⚡ Good' : '📉 Needs Work'}
      </span>
    </div>
  );
}

function ScoreBars({ hookStrength, emotionalTrigger, trendAlignment, ctaClarity }) {
  const bars = [
    { label: 'Hook Strength', val: hookStrength, max: 25, color: '#8b5cf6' },
    { label: 'Emotional Trigger', val: emotionalTrigger, max: 25, color: '#ec4899' },
    { label: 'Trend Alignment', val: trendAlignment, max: 25, color: '#06b6d4' },
    { label: 'CTA Clarity', val: ctaClarity, max: 25, color: '#10b981' },
  ];
  return (
    <div className="score-bar-wrap">
      {bars.map((b, i) => (
        <div key={i} className="score-row">
          <span className="score-label">{b.label}</span>
          <div className="score-track">
            <div className="score-fill"
              style={{ width: `${(b.val / b.max) * 100}%`, background: `linear-gradient(90deg, ${b.color}, ${b.color}aa)` }} />
          </div>
          <span className="score-num" style={{ color: b.color }}>{b.val}</span>
        </div>
      ))}
    </div>
  );
}

function ContentCard({ content }) {
  const [copied, setCopied] = useState(false);
  const icon = PLATFORM_ICONS[content.platform] || '📱';

  const copyAll = () => {
    navigator.clipboard.writeText(`${content.hook}\n\n${content.body}\n\n${content.cta}\n\n${content.hashtags.join(' ')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="content-card animate-in">
      <div className="content-card-header">
        <div className="platform-badge">
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span>{content.platform}</span>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: 10 }}>
          <span className={`tag ${content.virality_score.total >= 80 ? 'tag-green' : content.virality_score.total >= 65 ? 'tag-orange' : 'tag-red'}`}>
            Score: {content.virality_score.total}/100
          </span>
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 8 }} onClick={copyAll}>
            {copied ? '✅ Copied!' : '📋 Copy All'}
          </button>
        </div>
      </div>
      <div className="content-card-body">
        <div className="grid-2-1" style={{ gap: 20 }}>
          <div>
            <div className="content-field-label">🎣 Hook</div>
            <div className="content-hook">"{content.hook}"</div>

            <div className="content-field-label">📝 Body</div>
            <div className="content-field-value" style={{ fontSize: 13 }}>{content.body}</div>

            <div className="content-field-label">📣 Call To Action</div>
            <div style={{ fontSize: 14, color: '#a78bfa', fontWeight: 600, marginBottom: 14 }}>→ {content.cta}</div>

            <div className="content-field-label">🏷️ Hashtags</div>
            <div className="hashtag-list" style={{ marginBottom: 14 }}>
              {content.hashtags.map((h, i) => <span key={i} className="hashtag">{h}</span>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="content-field-label">📐 Format</div>
                <div style={{ fontSize: 13 }}>{content.format_tip}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div className="content-field-label">⏰ Best Time</div>
                <div style={{ fontSize: 13 }}>{content.best_post_time}</div>
              </div>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div className="content-field-label" style={{ marginBottom: 12 }}>🎯 Virality Breakdown</div>
            <ScoreGauge score={content.virality_score.total} />
            <div style={{ marginTop: 20 }}>
              <ScoreBars {...content.virality_score} />
            </div>
            <div style={{ marginTop: 16, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, marginBottom: 4 }}>💡 IMPROVEMENT TIP</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                {content.virality_score.improvement_tip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentGenerator() {
  const [brief, setBrief] = useState({
    topic: '', audience: '', goals: '', tone: 'Witty', platforms: []
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const togglePlatform = (p) => {
    setBrief(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p]
    }));
  };

  const handleGenerate = async () => {
    if (!brief.topic.trim()) { setError('Please enter a topic.'); return; }
    if (!brief.platforms.length) { setError('Select at least one platform.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await generateViralContent(brief);
      setResult(data);
    } catch (e) { setError('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-content animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div className="card card-glow-purple" style={{ position: 'sticky', top: 0 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>
            <span>✨ Content Brief</span>
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Product</label>
            <input className="form-input" placeholder="e.g. AI fitness tracker app"
              value={brief.topic} onChange={e => setBrief({ ...brief, topic: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Target Audience</label>
            <input className="form-input" placeholder="e.g. College students in India"
              value={brief.audience} onChange={e => setBrief({ ...brief, audience: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Goal</label>
            <input className="form-input" placeholder="e.g. Go viral, get 10K signups"
              value={brief.goals} onChange={e => setBrief({ ...brief, goals: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Tone</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TONES.map(t => (
                <div key={t} onClick={() => setBrief({ ...brief, tone: t })}
                  className="chip" style={{
                    borderColor: brief.tone === t ? 'var(--accent)' : 'var(--border)',
                    background: brief.tone === t ? 'rgba(139,92,246,0.15)' : 'transparent',
                    color: brief.tone === t ? '#a78bfa' : 'var(--text-secondary)',
                    fontSize: 12, padding: '5px 11px'
                  }}>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Platforms</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PLATFORMS.map(p => (
                <div key={p} onClick={() => togglePlatform(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    borderRadius: 8, border: `1px solid ${brief.platforms.includes(p) ? 'var(--accent)' : 'var(--border)'}`,
                    background: brief.platforms.includes(p) ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer', transition: 'all 0.15s', fontSize: 13, fontWeight: 500,
                    color: brief.platforms.includes(p) ? '#a78bfa' : 'var(--text-secondary)'
                  }}>
                  <span>{PLATFORM_ICONS[p]}</span>
                  <span style={{ flex: 1 }}>{p}</span>
                  {brief.platforms.includes(p) && <span style={{ color: 'var(--accent-3)', fontSize: 14 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 12, background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}

          <button className="btn btn-gradient" style={{ width: '100%', marginTop: 8 }}
            onClick={handleGenerate} disabled={loading}>
            {loading ? <><div className="spinner"></div> Generating...</> : '⚡ Generate Viral Content'}
          </button>
        </div>

        {/* Output */}
        <div>
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>ViralIQ Engine Running...</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Analyzing trends, scoring virality, and crafting platform-specific content for your audience.</div>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* AI Tip */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))',
                border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: 18,
                display: 'flex', gap: 14, alignItems: 'flex-start'
              }}>
                <div style={{ fontSize: 26 }}>💡</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Marketing Tip</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>{result.ai_tip}</div>
                </div>
              </div>

              {/* Per-platform cards */}
              {result.generated_content.map((c, i) => <ContentCard key={i} content={c} />)}
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state" style={{ minHeight: 400, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px dashed var(--border)' }}>
              <div className="empty-state-icon">✨</div>
              <div className="empty-state-title">Awaiting Your Brief</div>
              <div className="empty-state-sub">Fill in the form on the left and hit Generate to create full viral content strategies for your selected platforms.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
