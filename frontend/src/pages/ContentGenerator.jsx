import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, AlertCircle, Share2, Download, Copy, Zap, Flame } from 'lucide-react';
import { useViralEngine } from '../hooks/useViralEngine';

const TONES = ['Witty', 'Bold', 'Inspiring', 'Friendly', 'Professional', 'Emotional', 'Educational', 'Controversial'];
const PLATFORMS = [
  'Instagram', 'Facebook', 'WhatsApp', 'YouTube', 'TikTok',
  'X (Twitter)', 'Telegram', 'Snapchat', 'Messenger', 'WeChat',
  'Pinterest', 'Reddit', 'Threads', 'Twitch', 'LinkedIn',
  'ShareChat', 'Moj', 'Koo', 'Discord'
];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copy">
      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
    </button>
  );
};

export default function ContentGenerator() {
  const [brief, setBrief] = useState({
    topic: '',
    audience: '',
    goals: 'Go Viral',
    tone: 'Witty',
    platforms: ['Instagram']
  });

  const [result, setResult] = useState(null);
  const { generateContent, isGenerating, error } = useViralEngine();

  const handleTogglePlatform = (p) => {
    setBrief(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p) 
        : [...prev.platforms, p]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brief.topic || brief.platforms.length === 0) return;
    
    const data = await generateContent(brief);
    if (data) {
      setResult(data.content);

      // --- SYNC WITH ANALYTICS DASHBOARD ---
      try {
        const history = JSON.parse(localStorage.getItem('viralPostsHistory') || '[]');
        const platformStr = brief.platforms.length > 1 ? 'Omnichannel' : brief.platforms[0];
        const newPost = {
          id: Date.now(),
          title: `[NEW] ${brief.topic}`,
          reach: (Math.floor(Math.random() * 50) + 15) + 'K', // Sync mock logic
          er: (Math.random() * 6 + 4).toFixed(1) + '%',
          status: 'viral'
        };
        history.unshift(newPost);
        // keep up to 10 generated items
        localStorage.setItem('viralPostsHistory', JSON.stringify(history.slice(0, 10)));
      } catch (err) {
        console.error("Failed to sync to analytics", err);
      }
    }
  };

  return (
    <div className="page-content animate-in">
      <div className="grid-2-1">
        {/* Left: Input Form */}
        <div className="card glass-panel">
          <div className="section-title">
            <Sparkles size={18} />
            <span>Campaign Brief</span>
          </div>
          
          <form onSubmit={handleSubmit} className="brief-form">
            <div className="form-group">
              <label className="form-label">What's the topic or product?</label>
              <textarea 
                className="form-textarea"
                placeholder="e.g. A new ecosystem for AI sustainable energy..."
                value={brief.topic}
                onChange={(e) => setBrief({...brief, topic: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <input 
                  className="form-input"
                  type="text" 
                  placeholder="e.g. Gen-Z Tech Founders"
                  value={brief.audience}
                  onChange={(e) => setBrief({...brief, audience: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Main Goal</label>
                <select className="form-select" value={brief.goals} onChange={(e) => setBrief({...brief, goals: e.target.value})}>
                  <option value="Go Viral">Go Viral</option>
                  <option value="Drive Sales">Drive Sales</option>
                  <option value="Build Authority">Build Authority</option>
                  <option value="Educational">Educational</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Tone</label>
              <div className="chip-group">
                {TONES.map(t => (
                  <button 
                    key={t} type="button" 
                    className={`chip ${brief.tone === t ? 'active' : ''}`}
                    onClick={() => setBrief({...brief, tone: t})}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Platforms</label>
              <div className="platform-grid">
                {PLATFORMS.map(p => (
                  <button 
                    key={p} type="button" 
                    className={`platform-btn ${brief.platforms.includes(p) ? 'active' : ''}`}
                    onClick={() => handleTogglePlatform(p)}
                  >
                    <div className="platform-name">{p}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isGenerating}>
              {isGenerating ? (
                <>AI is Thinking... <div className="spinner-mini"></div></>
              ) : (
                <>Generate Viral Content <Send size={18} style={{marginLeft: 8}} /></>
              )}
            </button>
          </form>

          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: AI Insights (Static/Dynamic) */}
        <div className="sidebar-widgets">
          <div className="card glass-panel highlight-green">
            <div className="section-title">
              <Zap size={18} />
              <span>AI Engine Insight</span>
            </div>
            <p className="insight-text">
              {result?.ai_tip || `Enter your brief to receive platform-specific algorithm insights and virality boosters.`}
            </p>
          </div>

          <div className="card glass-panel">
            <div className="section-title">
              <Flame size={18} />
              <span>Hot Hashtags</span>
            </div>
            <div className="trending-list">
              {(result?.trending_hashtags || []).map((t, i) => (
                <div key={i} className="trend-item">
                  <span className="trend-tag">{t.hashtag}</span>
                  <span className="trend-badge">{t.reach_potential}</span>
                </div>
              ))}
              {!result && <div className="placeholder">Awaiting brief...</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Results Section */}
      {result && (
        <div className="results-section animate-up">
          <div className="results-header">
            <h3>✨ Platform-Specific Viral Content</h3>
            <div className="btn-group">
              <button className="btn btn-secondary btn-sm"><Copy size={14} /> Copy All</button>
              <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
            </div>
          </div>

          <div className="content-grid" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {result.generated_content.map((item, i) => (
              <div key={i} className="platform-ideation-block">
                <div className="section-title" style={{ fontSize: '20px', color: '#fff' }}>
                  {item.platform} Ideation Pack
                </div>

                {/* Descriptions Card */}
                {item.descriptions && item.descriptions.length > 0 && (
                  <div className="card glass-panel animated-slide-up" style={{ animationDelay: '0.1s', marginBottom: '20px' }}>
                    <div className="section-label">✍️ Creative Descriptions</div>
                    <div className="item-list">
                      {item.descriptions.map((desc, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-text">{desc}</div>
                          <CopyButton text={desc} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Captions Card */}
                {item.captions && item.captions.length > 0 && (
                  <div className="card glass-panel animated-slide-up" style={{ animationDelay: '0.2s', marginBottom: '20px' }}>
                    <div className="section-label">🪶 Viral Captions</div>
                    <div className="item-list">
                      {item.captions.map((cap, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-text">{cap}</div>
                          <CopyButton text={cap} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hashtags Card */}
                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="card glass-panel animated-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>🔖 Trending Hashtags</span>
                      <CopyButton text={item.hashtags.join(' ')} />
                    </div>
                    <div className="item-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                      {item.hashtags.map((tag, idx) => (
                        <div key={idx} className="item-row" style={{ marginBottom: 0, padding: '8px 12px' }}>
                          <div className="item-text tags">{tag}</div>
                          <CopyButton text={tag} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
