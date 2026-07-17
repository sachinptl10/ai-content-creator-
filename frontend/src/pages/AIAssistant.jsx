import React, { useState, useEffect, useRef } from 'react';
import '../ai-assistant.css';
import { Mic, Send, Sparkles, Zap, Link2, Play, Loader2, ChevronDown, ChevronUp, Copy, Check, Music, Clock, Edit3, Lightbulb, RefreshCw, Download, FileAudio, AlertCircle, CheckCircle2, Info, LayoutGrid, Terminal, Cpu, Radio, Activity, BrainCircuit, Camera } from 'lucide-react';
import TiltCard from '../components/TiltCard';
const generateParticles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: Math.random() * 360,
    distance: 130 + Math.random() * 90,
    size: 1.5 + Math.random() * 3,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.6,
  }));

const PARTICLES = generateParticles(28);

const SUGGESTIONS = [
  '🔥 Generate viral hooks',
  '📈 Analyse my trends',
  '✍️ Write a caption',
  '🎯 Strategy for TikTok',
];

// ── Mock vision analysis ──
function getMockVisionAnalysis() {
  return {
    subject: "Futuristic Urban Cyber-Structure",
    confidence: 98.4,
    composition: "Golden Ratio aligned. Rule of thirds utilized in the focal quadrant.",
    mood: "Cinematic, high-contrast, bioluminescent",
    colorPalette: ["#89E55E", "#111A15", "#F3F5EE", "#0D1411"],
    details: [
      "Detected high-density geometric patterns",
      "Atmospheric bioluminescence detected in shadows",
      "Professional-grade depth of field",
      "Cyber-organic texture synthesis"
    ]
  };
}

// ── Neural Vision HUD (NEW) ──
function NeuralVisionHUD({ onScanStart, onScanComplete }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const bUrl = URL.createObjectURL(file);
      setImage(bUrl);
      startNeuralScan();
    }
  };

  const startNeuralScan = async () => {
    setLoading(true);
    setResult(null);
    onScanStart(true);

    // Simulate deep neural analysis
    await new Promise(r => setTimeout(r, 3000));
    
    setResult(getMockVisionAnalysis());
    setLoading(false);
    onScanComplete();
  };

  return (
    <div className="neural-vision-hud">
      <div className="hud-header">
        <div className="hud-title">
          <BrainCircuit size={14} />
          <span>NEURAL_VISION // SPECTRAL_ANALYSIS</span>
        </div>
      </div>

      {!image ? (
        <div className="vision-dropzone" onClick={() => fileInputRef.current.click()}>
          <div className="dropzone-content">
            <div className="dropzone-icon-wrap">
              <Camera size={32} />
            </div>
            <h3>INTERCEPT VISUAL DATA</h3>
            <p>DRAG & DROP OR CLICK TO UPLOAD ARCHIVE</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div className="vision-active-area">
          <div className="vision-sequence-layout">
            <TiltCard depth={10}>
              <div className="vision-main-frame">
                <img src={image} alt="scan-target" className="vision-img" />
                {loading && <div className="vision-laser-sweep" />}
                <div className="frame-corners">
                  <div className="c-tl" /><div className="c-tr" />
                  <div className="c-bl" /><div className="c-br" />
                </div>
              </div>
            </TiltCard>

            {result && (
              <div className="vision-results-area">
                <div className="vision-header-row">
                  <Terminal size={14} />
                  <span>NEURAL ANALYSIS REPORT</span>
                </div>

                <div className="vision-details-stack">
                  <TiltCard depth={5}>
                    <div className="v-card-full">
                      <div className="mod-head"><BrainCircuit size={12} /> PRIMARY_SUBJECT</div>
                      <div className="v-label">{result.subject} (CONFIDENCE: {result.confidence}%)</div>
                    </div>
                  </TiltCard>

                  <TiltCard depth={5}>
                    <div className="v-card-full">
                      <div className="mod-head"><LayoutGrid size={12} /> SPATIAL_COMPOSITION</div>
                      <p className="v-txt">{result.composition}</p>
                    </div>
                  </TiltCard>

                  <div className="v-card-full v-analysis-report">
                    <div className="mod-head"><Activity size={12} /> NEURAL_DECOMPRESSION_LOG</div>
                    <div className="v-detail-list">
                      {result.details.map((d, i) => (
                        <div key={i} className="v-detail-item">
                          <Zap size={10} /> {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="vision-reset-btn" onClick={() => setImage(null)}>
                  <RefreshCw size={14} /> NEW INTERCEPTION
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Viral Command Center (Unified) ──
function ViralCommandCenter({ onScanStart, onScanComplete }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [dlSuccess, setDlSuccess] = useState(false);
  const [format, setFormat] = useState('mp3');
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const STEPS = [
    { label: 'Initializing Neural Scan...', p: 15 },
    { label: 'Accessing Platform API...', p: 30 },
    { label: 'Intercepting Audio Stream...', p: 50 },
    { label: 'Extracting Narrative Structure...', p: 70 },
    { label: 'Detecting Engagement Clusters...', p: 90 },
    { label: 'Synthesizing Viral Insights...', p: 100 },
  ];

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setInfo(null);
    setError('');
    onScanStart(true);

    try {
      // 1. Fetch Basic Info first (Functional)
      const token = localStorage.getItem('viraliq_token');
      const infoRes = await fetch(`${API}/api/audio/info?url=${encodeURIComponent(url.trim())}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const infoData = await infoRes.json();
      if (infoRes.ok) setInfo(infoData);

      // 2. Animate the AI Scan HUD
      for (const step of STEPS) {
        setStatus(step.label);
        setProgress(step.p);
        await new Promise(r => setTimeout(r, 600));
      }

      // 3. Complete Analysis
      const analysisData = getMockAnalysis(url.trim());
      setResult(analysisData);
      onScanComplete();
    } catch (err) {
      setError('Neural scan interrupted. Secure connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) return;
    setDlLoading(true);
    try {
      const token = localStorage.getItem('viraliq_token');
      const res = await fetch(`${API}/api/audio/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: url.trim(), format })
      });
      if (!res.ok) throw new Error('Data extraction failed');
      const blob = await res.blob();
      const bUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = bUrl;
      a.download = `ViralIQ_Extract_${Date.now()}.${format}`;
      a.click();
      setDlSuccess(true);
      setTimeout(() => setDlSuccess(false), 3000);
    } catch (e) {
      setError('Core extraction failed: File protected or unavailable.');
    } finally {
      setDlLoading(false);
    }
  };

  return (
    <div className="viral-command-center">
      {/* ── HUD INPUT ── */}
      <div className="hud-header">
        <div className="hud-title">
          <Terminal size={14} />
          <span>NEURAL SCANNER // CMD_VIRAL_IQ</span>
        </div>
        <div className="hud-stats">
          <div className="hud-stat-pill"><Radio size={10} /> SYSTEM: ACTIVE</div>
          <div className="hud-stat-pill"><Cpu size={10} /> CORE: ONLINE</div>
        </div>
      </div>

      <div className="hud-input-group">
        <div className={`hud-input-wrap ${loading ? 'scanning' : ''}`}>
          <LayoutGrid size={18} className="hud-icon-grid" />
          <input
            className="hud-input"
            placeholder="PASTE LINK TO SCAN / YT / TIKTOK / REELS / TWITTER"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          {loading && <div className="scanner-line" />}
        </div>
        <button className={`hud-scan-btn ${loading ? 'active' : ''}`} onClick={handleScan} disabled={loading || !url}>
          {loading ? 'INITIALIZING...' : 'SCAN LINK'}
        </button>
      </div>

      {loading && (
        <div className="hud-progress-area">
          <div className="hud-progress-bar">
            <div className="hud-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="hud-status-text">{status}</div>
        </div>
      )}

      {error && <div className="hud-error-msg"><AlertCircle size={14} /> {error}</div>}

      {/* ── HUD RESULTS ── */}
      {result && (
        <div className="hud-results-grid">
          {/* Top Result Level */}
          <div className="hud-result-top">
            {/* VIRALITY SCORE */}
            <TiltCard depth={10}>
              <div className="hud-score-card">
                <div className="score-ring-hud">
                  <svg viewBox="0 0 100 100" width="100" height="100">
                    <circle className="ring-bg-hud" cx="50" cy="50" r="45" />
                    <circle className="ring-val-hud" cx="50" cy="50" r="45" style={{ '--score': result.viralScore }} />
                  </svg>
                  <div className="score-val-text">{result.viralScore}</div>
                </div>
                <div className="score-lbl-hud">VIRALITY INDEX</div>
              </div>
            </TiltCard>

            {/* MEDIA DETAILS */}
            {info && (
              <TiltCard depth={10}>
                <div className="hud-media-card">
                  <div className="hud-media-thumb">
                    <img 
                      src={info.thumbnail} 
                      alt="thumb" 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/140x80/1A0F0D/C08552?text=MEDIA+SECURED'; }}
                    />
                    <div className="thumb-scan-line" />
                  </div>
                  <div className="hud-media-info">
                    <div className="hud-media-title">{info.title}</div>
                    <div className="hud-media-meta">
                      <span>SOURCE: {result.platform}</span>
                      <span>CREATOR: {info.uploader}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            )}
          </div>

          {/* Analysis Modules */}
          <div className="hud-module-row">
            {/* Hook Analysis */}
            <TiltCard depth={15}>
              <div className="hud-module m-hooks" style={{ height: '100%' }}>
                <div className="mod-head"><Activity size={12} /> NARRATIVE ARC</div>
                <div className="mod-body">
                  <div className="arc-step">
                    <span className="step-label">HOOK</span>
                    <span className="step-txt">{result.hook.text}</span>
                  </div>
                  <div className="arc-step">
                    <span className="step-label">MID</span>
                    <span className="step-txt">{result.middle.text}</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* AI Re-write */}
            <TiltCard depth={15}>
              <div className="hud-module m-captions" style={{ height: '100%' }}>
                <div className="mod-head"><Edit3 size={12} /> AI RE-CODE</div>
                <div className="mod-body">
                  <div className="hud-caption-preview">{result.newCaption}</div>
                  <button className="hud-copy-btn" onClick={() => navigator.clipboard.writeText(result.newCaption)}>
                    <Copy size={12} /> COPY NUCLEUS
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Final Actions Area */}
          <div className="hud-actions-bar">
            <div className="hud-extractor">
              <div className="ext-head">HIGH-FIDELITY EXTRACTION</div>
              <div className="ext-controls">
                <select className="hud-select" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="mp3">MP3 // LOSSLESS</option>
                  <option value="m4a">M4A // WEB</option>
                </select>
                <button className={`hud-dl-btn ${dlLoading ? 'loading' : ''}`} onClick={handleDownload} disabled={dlLoading}>
                  {dlLoading ? <Loader2 size={14} className="spin" /> : dlSuccess ? <Check size={14} /> : <Download size={14} />}
                  {dlSuccess ? 'DOWNLOADED' : 'EXTRACT AUDIO'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main AI Assistant Page ──
export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [orbPulse, setOrbPulse] = useState(false);
  const [orbScanning, setOrbScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'analyze' | 'vision'
  const chatRef = useRef(null);

  useEffect(() => {
    if (listening || orbScanning) {
      setOrbPulse(true);
    } else {
      const t = setTimeout(() => setOrbPulse(false), 800);
      return () => clearTimeout(t);
    }
  }, [listening, orbScanning]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setOrbPulse(true);
    setListening(false);
    
    // Add temporary AI loading state
    setMessages(prev => [...prev, { role: 'ai', text: 'SYNTHESIZING NEURAL RESPONSE...', loading: true }]);

    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const token = localStorage.getItem('viraliq_token');
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg.text })
      });
      
      if (!res.ok) throw new Error('Neural link failed');
      
      const data = await res.json();
      
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs.pop(); // Remove loading msg
        return [...newMsgs, { role: 'ai', text: data.reply }];
      });
    } catch (err) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs.pop();
        return [...newMsgs, { role: 'ai', text: 'ERROR: connection lost to Groq instance.' }];
      });
    } finally {
      setTimeout(() => setOrbPulse(false), 500);
    }
  };

  return (
    <div className="ai-assistant-root">

      {/* Header */}
      <div className="ai-header">
        <div className="ai-header-logo"><Zap size={16}/><span>ViralIQ&nbsp;<strong>AI</strong></span></div>
        <div className="ai-status-dot" />
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="ai-split-layout">
        
        {/* ── LEFT PANE: ORB ── */}
        <div className="ai-left-pane">
          <TiltCard depth={30}>
            <div className={`ai-orb-area ${orbPulse ? 'pulse-active' : ''} ${orbScanning ? 'scan-active' : ''}`}>
              <div className="ai-bg-glow" />
              <div className="orb-ring ring-1" style={{ transform: 'translate(-50%, -50%) translateZ(-20px)' }} />
              <div className="orb-ring ring-2" style={{ transform: 'translate(-50%, -50%) translateZ(-40px)' }} />
              <div className="orb-ring ring-3" style={{ transform: 'translate(-50%, -50%) translateZ(-60px)' }} />
              {PARTICLES.map(p => (
                <div key={p.id} className="orb-particle" style={{
                  '--angle': `${p.angle}deg`, '--dist': `${p.distance}px`,
                  '--size': `${p.size}px`, '--dur': `${p.duration}s`,
                  '--delay': `${p.delay}s`, '--opacity': p.opacity,
                  transform: `translate(-50%, -50%) translateZ(${Math.random() * 50}px)`
                }} />
              ))}
              <div className={`ai-orb ${orbPulse ? 'orb-listening' : ''} ${orbScanning ? 'orb-scanning' : ''}`} style={{ transform: 'translate(-50%, -50%) translateZ(50px)' }}>
                <div className="orb-inner" />
                <div className="orb-core" />
                <BrainCircuit size={40} className={`orb-icon ${orbPulse ? 'pulse' : ''}`} style={{ transform: 'translateZ(20px)' }} />
              </div>
              <div className="ai-greeting" style={{ transform: 'translate(-50%, -50%) translateZ(80px)' }}>SYSTEM ONLINE</div>
            </div>
          </TiltCard>
        </div>

        {/* ── RIGHT PANE: CONTENT ── */}
        <div className="ai-right-pane">
          {/* Mode Tabs (Now perfectly aligned over chat) */}
          <div className="ai-mode-tabs">
            <button className={`ai-mode-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <Radio size={14}/> NEURAL_CHAT
            </button>
            <button className={`ai-mode-tab ${activeTab === 'analyze' ? 'active' : ''}`} onClick={() => setActiveTab('analyze')}>
              <LayoutGrid size={14}/> VIRAL_SCANNER
            </button>
            <button className={`ai-mode-tab ${activeTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveTab('vision')}>
              <Sparkles size={14}/> NEURAL_VISION
            </button>
          </div>

          {/* ── CHAT MODE ── */}
          {activeTab === 'chat' && (
            <div className="ai-chat-mode">
              {messages.length > 0 && (
                <div className="ai-chat-log" ref={chatRef}>
                  {messages.map((m, i) => (
                    <div key={i} className={`ai-msg ai-msg-${m.role}`}>
                      {m.role === 'ai' && <Cpu size={14} className="ai-msg-icon"/>}
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {messages.length === 0 && (
                <div className="ai-suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <button key={i} className="ai-suggestion-chip" onClick={() => setInput(s.replace(/^.{2}\s/, ''))}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="ai-input-bar">
                <button className={`ai-mic-btn ${listening ? 'ai-mic-active' : ''}`} onClick={() => setListening(l => !l)}>
                  <Mic size={18}/>
                </button>
                <input className="ai-input" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="ENTER PROTOCOL COMMAND..." />
                <button className={`ai-send-btn ${input.trim() ? 'active' : ''}`} onClick={sendMessage}>
                  <Send size={18}/>
                </button>
              </div>
            </div>
          )}

          {/* ── ANALYZE MODE (COMMAND CENTER) ── */}
          {activeTab === 'analyze' && (
            <div className="ai-analyze-mode">
              <ViralCommandCenter 
                onScanStart={() => setOrbScanning(true)} 
                onScanComplete={() => setOrbScanning(false)} 
              />
            </div>
          )}

          {/* ── VISION MODE (NEW) ── */}
          {activeTab === 'vision' && (
            <div className="ai-analyze-mode">
              <NeuralVisionHUD 
                onScanStart={() => setOrbScanning(true)} 
                onScanComplete={() => setOrbScanning(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
