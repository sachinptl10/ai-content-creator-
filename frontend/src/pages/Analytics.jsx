import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Search, 
  Filter, 
  Download, 
  Maximize2 
} from 'lucide-react';
import client from '../api/client';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrend: [],
    platformRadar: [],
    demographics: [],
    topPosts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleExport = () => {
    let report = `======================================\nVIRALIQ PERFORMANCE REPORT\nGenerated: ${new Date().toLocaleString()}\nTime Range: ${timeRange}\n======================================\n\n`;
    
    report += `[ TOP PERFORMING ASSETS ]\n\n`;
    analyticsData.topPosts.forEach(p => {
      report += `>> ${p.title}\n`;
      report += `   Reach: ${p.reach} | Engagement: ${p.er} | Virality: ${p.status.toUpperCase()}\n`;
      report += `   Insight: This asset outperformed benchmarks by 3x. Highly recommended for repurposing.\n\n`;
    });

    report += `--------------------------------------\n[ GROWTH TRAJECTORY ]\n\n`;
    analyticsData.monthlyTrend.forEach(m => {
      report += `- ${m.name}: ${m.organic.toLocaleString()} Organic Impressions, ${m.viral.toLocaleString()} Viral Amplification\n`;
    });

    report += `\n--------------------------------------\n[ AUDIENCE DEMOGRAPHICS ]\n\n`;
    analyticsData.demographics.forEach(d => {
      report += `- Age ${d.name}: Male ${d.male}%, Female ${d.female}%\n`;
    });

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ViralIQ_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMockData = (range) => {
    let mock;

    if (range === '1Y') {
      mock = {
        monthlyTrend: [
          { name: 'Jan', organic: 12000, viral: 8000 }, { name: 'Feb', organic: 15000, viral: 4000 },
          { name: 'Mar', organic: 11000, viral: 25000 }, { name: 'Apr', organic: 18000, viral: 6000 },
          { name: 'May', organic: 22000, viral: 15000 }, { name: 'Jun', organic: 30000, viral: 35000 },
          { name: 'Jul', organic: 25000, viral: 12000 }, { name: 'Aug', organic: 28000, viral: 18000 },
          { name: 'Sep', organic: 35000, viral: 45000 }, { name: 'Oct', organic: 32000, viral: 22000 },
          { name: 'Nov', organic: 40000, viral: 50000 }, { name: 'Dec', organic: 45000, viral: 62000 },
        ],
        platformRadar: [
          { subject: 'Reach', A: 140, B: 120, fullMark: 150 }, { subject: 'Engagement', A: 110, B: 140, fullMark: 150 },
          { subject: 'Shares', A: 90, B: 135, fullMark: 150 }, { subject: 'Saves', A: 120, B: 110, fullMark: 150 },
          { subject: 'Retention', A: 95, B: 100, fullMark: 150 }, { subject: 'Conversion', A: 85, B: 105, fullMark: 150 },
        ],
        demographics: [
          { name: '18-24', male: 42, female: 25, amt: 2400 }, { name: '25-34', male: 33, female: 18, amt: 2210 },
          { name: '35-44', male: 15, female: 15, amt: 2290 }, { name: '45+', male: 10, female: 42, amt: 2000 },
        ],
        topPosts: [
          { id: 'm1', title: 'Annual Recap Video', reach: '250K', er: '12.4%', status: 'viral' },
          { id: 'm2', title: 'Tech Trends 2026', reach: '180K', er: '9.1%', status: 'high' },
          { id: 'm3', title: 'Founders Story', reach: '120K', er: '11.5%', status: 'viral' },
        ]
      };
    } else if (range === '90D') {
      mock = {
        monthlyTrend: [
          { name: 'Month 1', organic: 8000, viral: 12000 }, { name: 'Month 2', organic: 12000, viral: 28000 },
          { name: 'Month 3', organic: 15000, viral: 9000 },
        ],
        platformRadar: [
          { subject: 'Reach', A: 130, B: 115, fullMark: 150 }, { subject: 'Engagement', A: 105, B: 135, fullMark: 150 },
          { subject: 'Shares', A: 88, B: 132, fullMark: 150 }, { subject: 'Saves', A: 105, B: 105, fullMark: 150 },
          { subject: 'Retention', A: 90, B: 95, fullMark: 150 }, { subject: 'Conversion', A: 75, B: 95, fullMark: 150 },
        ],
        demographics: [
          { name: '18-24', male: 41, female: 24, amt: 2400 }, { name: '25-34', male: 31, female: 15, amt: 2210 },
          { name: '35-44', male: 18, female: 25, amt: 2290 }, { name: '45+', male: 10, female: 36, amt: 2000 },
        ],
        topPosts: [
          { id: 'm1', title: 'Quarterly Strategy Guide', reach: '85K', er: '9.8%', status: 'viral' },
          { id: 'm2', title: 'Q3 Feature Launch', reach: '62K', er: '7.2%', status: 'high' },
          { id: 'm3', title: 'Behind the Scenes Toolkit', reach: '45K', er: '6.5%', status: 'steady' },
        ]
      };
    } else {
      mock = {
        monthlyTrend: [
          { name: 'Week 1', organic: 4000, viral: 2400 }, { name: 'Week 2', organic: 3000, viral: 1398 },
          { name: 'Week 3', organic: 2000, viral: 9800 }, { name: 'Week 4', organic: 2780, viral: 3908 },
        ],
        platformRadar: [
          { subject: 'Reach', A: 120, B: 110, fullMark: 150 }, { subject: 'Engagement', A: 98, B: 130, fullMark: 150 },
          { subject: 'Shares', A: 86, B: 130, fullMark: 150 }, { subject: 'Saves', A: 99, B: 100, fullMark: 150 },
          { subject: 'Retention', A: 85, B: 90, fullMark: 150 }, { subject: 'Conversion', A: 65, B: 85, fullMark: 150 },
        ],
        demographics: [
          { name: '18-24', male: 40, female: 24, amt: 2400 }, { name: '25-34', male: 30, female: 13, amt: 2210 },
          { name: '35-44', male: 20, female: 98, amt: 2290 }, { name: '45+', male: 27, female: 39, amt: 2000 },
        ],
        topPosts: [
          { id: 'm1', title: 'AI Ethics Thread', reach: '42.5K', er: '8.2%', status: 'viral' },
          { id: 'm2', title: 'Morning Routine Reel', reach: '31.2K', er: '6.4%', status: 'high' },
          { id: 'm3', title: 'LinkedIn Branding', reach: '18.9K', er: '5.1%', status: 'steady' },
        ]
      };
    }

    // --- INTEGRATE DYNAMIC CONTENT GENERATOR HISTORY ---
    try {
      const generatedRaw = localStorage.getItem('viralPostsHistory');
      if (generatedRaw) {
        const generatedPosts = JSON.parse(generatedRaw);
        if (generatedPosts && generatedPosts.length > 0) {
          // Prepend generated campaigns into our Top Posts Table!
          mock.topPosts = [...generatedPosts, ...mock.topPosts].slice(0, 7);

          // Mathematically Bump The Graph!
          // Every piece of generated content pushes a recursive surge of metrics to the graph's most recent timeline node.
          const lastPoint = mock.monthlyTrend[mock.monthlyTrend.length - 1];
          lastPoint.organic += (generatedPosts.length * 2500); 
          lastPoint.viral += (generatedPosts.length * 8400);   // Huge viral bump per valid generation
        }
      }
    } catch (e) {
      console.warn("Could not sync generator history via localStorage", e);
    }
    
    return mock;
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay / recalculation block for UI realism
    setTimeout(() => {
      setAnalyticsData(getMockData(timeRange));
      setIsLoading(false);
    }, 400);
  }, [timeRange]);

  return (
    <div className="page-content animate-in">
      {/* Top Controls */}
      <div className="analytics-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div className="filter-group">
          <button className={`btn btn-secondary ${timeRange === '30D' ? 'active' : ''}`} onClick={() => setTimeRange('30D')}>Last 30 Days</button>
          <button className={`btn btn-secondary ${timeRange === '90D' ? 'active' : ''}`} onClick={() => setTimeRange('90D')}>90 Days</button>
          <button className={`btn btn-secondary ${timeRange === '1Y' ? 'active' : ''}`} onClick={() => setTimeRange('1Y')}>1 Year</button>
        </div>
        <button className="btn btn-primary" onClick={handleExport}><Download size={16} /> Export Detailed Report</button>
      </div>

      <div className="grid-2-1">
        {/* Growth Over Time (Area Chart) */}
        <div className="card glass-panel">
          <div className="section-title">
            <TrendingUp size={18} />
            <span>Growth Trajectory (Organic vs Viral)</span>
          </div>
          <div style={{ width: '100%', height: 350, marginTop: 20 }}>
            <ResponsiveContainer>
              <AreaChart data={analyticsData.monthlyTrend}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#89E55E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#89E55E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="organic" stroke="#89E55E" fillOpacity={1} fill="url(#colorOrganic)" />
                <Area type="monotone" dataKey="viral" stroke="#4ade80" fillOpacity={1} fill="url(#colorViral)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reach Radar Chart */}
        <div className="card glass-panel highlight-green" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelectedDetail({
          type: "Quality Audit",
          title: "Strategy A vs Strategy B",
          data: analyticsData.platformRadar,
          insight: "Strategy A dominates Reach, while Strategy B provides stronger Engagement and Shares. A hybrid focus is recommended."
        })}>
          <div className="section-title">
            <Target size={18} />
            <span>Reach Quality Audit (Click for Details)</span>
          </div>
          <div style={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.platformRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                <Radar name="Strategy A" dataKey="A" stroke="#89E55E" fill="#89E55E" fillOpacity={0.6} />
                <Radar name="Strategy B" dataKey="B" stroke="#4ade80" fill="#4ade80" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-1-2" style={{ marginTop: 24 }}>
        {/* Audience Age/Gender (Bar Chart) */}
        <div className="card glass-panel">
          <div className="section-title">
            <Search size={18} />
            <span>Audience Segments</span>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: 20 }}>
            <ResponsiveContainer>
              <BarChart data={analyticsData.demographics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="male" fill="#89E55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Table */}
        <div className="card glass-panel">
          <div className="section-title">
            <Zap size={18} />
            <span>Platform-Level Performance</span>
          </div>
          <div className="analytics-table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Content Asset</th>
                  <th>Total reach</th>
                  <th>Engagement rate</th>
                  <th>Virality Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topPosts.map((post) => (
                  <tr 
                    key={post.id} 
                    style={{ cursor: 'pointer', transition: 'background 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(137,229,94,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setSelectedDetail({
                      type: "Content Breakdown",
                      title: post.title,
                      reach: post.reach,
                      er: post.er,
                      status: post.status.toUpperCase(),
                      insight: `This post engaged heavily with the 18-24 demographic, driving ${Math.floor(Math.random() * 500 + 200)} saves. The hook generated a 45% better retention rate than account average.`
                    })}
                  >
                    <td style={{ color: '#fff', fontWeight: 500 }}>{post.title}</td>
                    <td>{post.reach}</td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>{post.er}</td>
                    <td><span className={`status-pill ${post.status}`}>{post.status.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Details Modal */}
      {selectedDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedDetail(null)}>
          <div className="card glass-panel animate-up" style={{ minWidth: '400px', maxWidth: '600px', background: '#0a110e', border: '1px solid #89E55E', boxShadow: '0 0 40px rgba(137,229,94,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#89E55E' }}>{selectedDetail.type}</h3>
              <button onClick={() => setSelectedDetail(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '24px', margin: '0 0 16px 0', color: '#fff' }}>{selectedDetail.title}</h2>
              {selectedDetail.reach && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Reach</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedDetail.reach}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Engagement</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399' }}>{selectedDetail.er}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Status</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316' }}>{selectedDetail.status}</div>
                  </div>
                </div>
              )}
              {selectedDetail.data && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  {JSON.stringify(selectedDetail.data, null, 2)}
                </div>
              )}
              <div style={{ borderLeft: '4px solid #89E55E', background: 'rgba(137,229,94,0.1)', padding: '16px', borderRadius: '0 8px 8px 0', fontSize: '15px', lineHeight: '1.6' }}>
                <strong>AI Insight:</strong> {selectedDetail.insight}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
