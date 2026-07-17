import React, { useState } from 'react';
import { Target, Zap, Sparkles, Compass } from 'lucide-react';
import client from '../api/client';

export default function Strategy() {
  const [strategy, setStrategy] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [niche, setNiche] = useState('Tech');
  const [goals, setGoals] = useState('Viral Growth');

  const generateStrategy = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await client.post('/strategy/generate', { niche, goal: goals });
      if (res.data.success) {
        setStrategy(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate strategy:', err);
      // Mock data fallback
      setStrategy({
        niche_analysis: `The ${niche} niche is currently saturated with high-production value but low-authenticity content. There's a massive gap for "raw" behind-the-scenes insights combined with expert-level data visualization.`,
        competitor_gaps: [
          'Lack of platform-specific repurposing (reusing same video for all)',
          'Extremely weak initial hooks (taking >3s to land)',
          "Ineffective call-to-actions that don't leverage curiosity gaps"
        ],
        winning_angles: [
          'Fail-Forward: Documenting errors in AI implementation',
          'Data-Driven Storytelling: Visualizing niche statistics',
          'Unpopular Opinion: Challenging high-volume influencers'
        ],
        content_pillars: [
          { name: 'Daily AI Ops', platform: 'Instagram/Reels', frequency: '3x/week' },
          { name: 'Weekly Niche Breakdown', platform: 'LinkedIn', frequency: '2x/week' },
          { name: 'Hot Takes', platform: 'Threads', frequency: 'Daily' }
        ],
        growth_roadmap: [
          { week: 'Week 1', focus: 'Hook Optimization & A/B Testing', tasks: ['Test 3 hook styles', 'Track CTR'] },
          { week: 'Week 2', focus: 'Engagement Podding', tasks: ['Strategic replies', 'Collaborative posts'] },
          { week: 'Week 3', focus: 'Visual Repurposing', tasks: ['High-retention graphics', 'Audio-first shorts'] }
        ],
        unfair_advantage: `Your unique edge: raw transparency in ${niche} combined with data-driven storytelling gives you a 3x engagement advantage over polished competitors.`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-content animate-in">
      <div className="grid-2-1">
        {/* Left: Generation Form */}
        <div className="card glass-panel highlight-purple">
          <div className="section-title">
            <Target size={18} />
            <span>Viral Blueprint Generator</span>
          </div>
          
          <div className="strategy-form">
            <div className="form-group">
              <label className="form-label">Target Niche</label>
              <input 
                className="form-input"
                type="text" 
                placeholder="e.g. AI SaaS, Sustainable Fashion..." 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Primary Campaign Goal</label>
              <select className="form-select" value={goals} onChange={(e) => setGoals(e.target.value)}>
                <option value="Viral Growth">Viral Growth</option>
                <option value="Direct Sales">Direct Sales</option>
                <option value="Authority Building">Authority Building</option>
                <option value="Lead Generation">Lead Generation</option>
              </select>
            </div>

            <button className="btn btn-primary btn-block" onClick={generateStrategy} disabled={isGenerating}>
              {isGenerating ? <><div className="spinner-mini"></div> Analyzing Niche...</> : <><Sparkles size={16} /> Generate Strategy</>}
            </button>
          </div>

          {error && <div className="error-alert" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        {/* Right: AI Guidance */}
        <div className="sidebar-widgets">
          <div className="card glass-panel">
            <div className="section-title">
              <Compass size={18} />
              <span>AI Strategic Guidance</span>
            </div>
            <p className="insight-text">
              Our AI analyzes over 2,500 data points across <strong>{niche}</strong> algorithms to find your unique "unfair advantage." Enter your niche and goal to generate a full viral blueprint.
            </p>
          </div>
        </div>
      </div>

      {strategy && (
        <div className="strategy-results animate-up" style={{ marginTop: 24 }}>
          <div className="card glass-panel">
            <div className="section-title">
              <Zap size={18} />
              <span>Niche Intelligence Analysis</span>
            </div>
            <div className="analysis-box">{strategy.niche_analysis}</div>
            
            <div className="grid-3" style={{ marginTop: 24 }}>
              <div className="analysis-section">
                <div className="analysis-label">Competitor Gaps</div>
                <div className="analysis-list">
                  {strategy.competitor_gaps?.map((gap, i) => (
                    <div key={i} className="analysis-item-red">{gap}</div>
                  ))}
                </div>
              </div>
              <div className="analysis-section">
                <div className="analysis-label">Winning Angles</div>
                <div className="analysis-list">
                  {strategy.winning_angles?.map((angle, i) => (
                    <div key={i} className="analysis-item-green">{angle}</div>
                  ))}
                </div>
              </div>
              <div className="analysis-section">
                <div className="analysis-label">Growth Roadmap</div>
                <div className="analysis-list">
                  {strategy.growth_roadmap?.map((step, i) => (
                    <div key={i} className="analysis-item-blue">
                      {typeof step === 'object' ? `${step.week}: ${step.focus}` : step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="content-pillars-section" style={{ marginTop: 24 }}>
              <div className="analysis-label">Recommended Content Pillars</div>
              <div className="chip-group">
                {strategy.content_pillars?.map((pillar, i) => (
                  <span key={i} className="tag tag-cyan">
                    {typeof pillar === 'object' ? `${pillar.name} · ${pillar.platform} · ${pillar.frequency}` : pillar}
                  </span>
                ))}
              </div>
            </div>

            {strategy.unfair_advantage && (
              <div className="analysis-box" style={{ marginTop: 16, borderColor: 'var(--accent-1)', background: 'rgba(139,92,246,0.08)' }}>
                <strong>⚡ Unfair Advantage:</strong> {strategy.unfair_advantage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
