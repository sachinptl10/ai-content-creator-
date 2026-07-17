import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Search, Hash, Globe, Compass, Share2, PlusCircle, AlertCircle, RefreshCw, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Play, Video } from 'lucide-react';
import client from '../api/client';
import TiltCard from '../components/TiltCard';

const getPlatformIcon = (platform = '') => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram size={14} />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter size={14} />;
  if (p.includes('linkedin')) return <Linkedin size={14} />;
  if (p.includes('youtube')) return <Youtube size={14} />;
  if (p.includes('threads')) return <MessageCircle size={14} />;
  if (p.includes('tiktok') || p.includes('reels')) return <Play size={14} />;
  return <Globe size={14} />;
};

export default function TrendLab() {
  const [niche, setNiche] = useState('Tech');
  const [trends, setTrends] = useState([]);
  const [globalPulse, setGlobalPulse] = useState(null);
  const [nicheInsight, setNicheInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrends = async (targetNiche) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await client.get(`/trends/${encodeURIComponent(targetNiche)}`);
      if (res.data.success) {
        setTrends(res.data.data || []);
        if (res.data.globalPulse) setGlobalPulse(res.data.globalPulse);
        if (res.data.nicheInsight) setNicheInsight(res.data.nicheInsight);
      }
    } catch (err) {
      console.error('Failed to fetch trends:', err);
      setError('Could not load trends. Showing cached data.');
      // Fallback mock data
      setTrends([
        { id: 1, tag: '#AIRevolution', volume: '1.2M', platform: 'Twitter/X', angle: 'The hidden cost of AI adoption', potential: 'Viral' },
        { id: 2, tag: '#SustainableEnergy', volume: '840K', platform: 'Instagram', angle: 'Solar ecosystems at home', potential: 'High' },
        { id: 3, tag: '#PersonalBranding', volume: '620K', platform: 'LinkedIn', angle: 'Why consistency beats talent in 2026', potential: 'High' },
        { id: 4, tag: '#RemoteWorkTech', volume: '450K', platform: 'Threads', angle: 'My zero-monitor VR workspace', potential: 'Medium' },
        { id: 5, tag: '#CreatorEconomy', volume: '380K', platform: 'YouTube', angle: 'How I built a 1M audience alone', potential: 'Viral' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(niche);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrends(niche);
  };

  const pulseRows = globalPulse ? [
    { label: 'Content Strategy Shift', value: globalPulse.content_strategy_shift || 'Video-First', status: 'dominant' },
    { label: 'Audience Attention Span', value: globalPulse.audience_attention_span || '7.8s', status: 'decreasing' },
    { label: 'Algorithm Primary Signal', value: globalPulse.algorithm_primary_signal || 'Save Ratio', status: 'high-impact' },
    { label: 'Save Ratio Importance', value: globalPulse.save_ratio_importance || 'High', status: 'high-impact' },
  ] : [
    { label: 'Content Strategy Shift', value: 'Video-First', status: 'dominant' },
    { label: 'Audience Attention Span', value: '7.8s', status: 'decreasing' },
    { label: 'Algorithm Primary Signal', value: 'Save Ratio', status: 'high-impact' },
  ];

  return (
    <div className="page-content animate-in">
      {/* Header / Search */}
      <div className="card glass-panel spotlight-header">
        <div className="spotlight-content">
          <h1><Flame size={24} style={{ color: '#89E55E' }} /> Trend Intelligence Lab</h1>
          <p>Analyze real-time search signals, hashtag resonance, and platform-specific content angles across any niche.</p>

          <form onSubmit={handleSearch} className="search-bar-container">
            <div className="search-icon"><Search size={18} /></div>
            <input
              type="text"
              placeholder="Search trends in any niche (e.g. Crypto, Fitness, AI)..."
              className="search-input"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ backgroundColor: '#89E55E', color: '#111A15', border: 'none' }}>
              {isLoading ? (
                <><RefreshCw size={16} className="spin" /> Analyzing...</>
              ) : 'Analyze Niche'}
            </button>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="loading-trends">
          <div className="spinner-mini" style={{ width: 32, height: 32 }}></div>
          <p>AI is analyzing {niche} trends across all platforms...</p>
        </div>
      )}
      {!isLoading && trends.length > 0 && (
        <div className="grid-3 mt-4">
          {trends.map((item, idx) => (
            <TiltCard key={idx} depth={10}>
              <div className="card entry-card glass-panel animated-slide-up" style={{ animationDelay: `${idx * 0.1}s`, height: '100%' }}>
                <div className="entry-header">
                  <div className="platform-pill">
                    {getPlatformIcon(item.platform)}
                    <span>{item.platform}</span>
                  </div>
                  <div className={`potential-badge ${(item.velocity || item.potential || '').toLowerCase()}`}>
                    {item.velocity || item.potential}
                  </div>
                </div>

                <div className="trend-main" style={{ marginBottom: '16px' }}>
                  <div className="trend-tag">
                    <Hash size={18} /> {item.hashtag || item.tag}
                  </div>
                  <div className="trend-volume">
                    {item.impressions_24h || item.volume} impressions / 24h
                  </div>
                </div>

                {item.topic && (
                  <div className="trend-angle">
                    <div className="angle-label">Core Topic:</div>
                    <div className="angle-text">{item.topic}</div>
                  </div>
                )}

                <div className="trend-angle">
                  <div className="angle-label">Recommended Angle:</div>
                  <div className="angle-text">"{item.content_angle || item.angle}"</div>
                </div>

                {(item.why_trending) && (
                  <div className="trend-angle">
                    <div className="angle-label">Why it's trending:</div>
                    <div className="angle-text">{item.why_trending}</div>
                  </div>
                )}

                <div className="entry-footer">
                  <button className="btn btn-secondary btn-sm"><PlusCircle size={14} /> Draft Post</button>
                  <button className="btn btn-icon"><Share2 size={14} /></button>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      <div className="grid-2-1" style={{ marginTop: 24 }}>
        {/* Global Trend Pulse */}
        <div className="card glass-panel animated-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="section-title">
            <Globe size={18} />
            <span>Global Market Pulse</span>
          </div>
          <div className="pulse-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {pulseRows.map((p, i) => (
              <div key={i} className="pulse-row" style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <span className="pulse-label" style={{ color: '#8b5cf6', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{p.label}</span>
                <span className="pulse-text" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Intelligence */}
        <div className="card glass-panel highlight-purple animated-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="section-title">
            <Compass size={18} />
            <span>AI Niche Insight</span>
          </div>
          <div className="niche-insights-detailed" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '14px', lineHeight: '1.6' }}>
            {nicheInsight?.hook_type && (
              <div><strong style={{ color: '#a78bfa' }}>🎣 Top Hook:</strong> <br />{nicheInsight.hook_type}</div>
            )}
            {nicheInsight?.platform_winning && (
              <div><strong style={{ color: '#22d3ee' }}>🏆 Winning Platform:</strong> <br />{nicheInsight.platform_winning}</div>
            )}
            {nicheInsight?.weekly_trend && (
              <div><strong style={{ color: '#34d399' }}>📈 Weekly Trend:</strong> <br />{nicheInsight.weekly_trend}</div>
            )}
            <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', borderLeft: '4px solid #10b981', borderRadius: '0 10px 10px 0', marginTop: '8px' }}>
              <strong style={{ color: '#10b981', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>💡 Actionable Recommendation</strong>
              {nicheInsight?.recommendation || `Pivot towards highly visual carousels for educational topics in ${niche}.`}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-toast">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
