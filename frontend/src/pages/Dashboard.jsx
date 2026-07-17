import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart,
  Zap,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import TiltCard from '../components/TiltCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReach: '0',
    engagementRate: '0%',
    avgViralityScore: 0,
    contentPieces: 0,
    weeklyReach: [],
    platformSplit: [],
    recentActivity: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await client.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Fallback to mock data for demo if API isn't fully ready
        setStats({
          totalReach: '1.24M',
          engagementRate: '5.8%',
          avgViralityScore: 78,
          contentPieces: 142,
          weeklyReach: [
            { name: 'Mon', reach: 4000 },
            { name: 'Tue', reach: 3000 },
            { name: 'Wed', reach: 2000 },
            { name: 'Thu', reach: 2780 },
            { name: 'Fri', reach: 1890 },
            { name: 'Sat', reach: 2390 },
            { name: 'Sun', reach: 3490 },
          ],
          platformSplit: [
            { name: 'Instagram', value: 400 },
            { name: 'X', value: 300 },
            { name: 'LinkedIn', value: 300 },
            { name: 'YouTube', value: 200 },
          ],
          recentActivity: [
            { id: 1, type: 'Generation', label: 'AI Sustainable Energy', time: '2h ago', status: 'success' },
            { id: 2, type: 'Schedule', label: 'Instagram Reel', time: '4h ago', status: 'pending' },
            { id: 3, type: 'Analytics', label: 'Platform Audit', time: 'Yesterday', status: 'success' },
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const COLORS = ['#C08552', '#8C5A3C', '#FFF8F0', '#4B2E2B'];

  return (
    <div className="page-content animate-in">
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <TiltCard depth={5}>
          <div className="card glass-panel stat-card highlight-amber" style={{ height: '100%' }}>
            <div className="stat-icon" style={{ background: 'rgba(192, 133, 82, 0.2)' }}><Users size={20} color="var(--accent)" /></div>
            <div className="stat-content">
              <div className="stat-label">Total Reach</div>
              <div className="stat-value">{stats.totalReach}</div>
              <div className="stat-trend positive">+12.4% from last month</div>
            </div>
          </div>
        </TiltCard>

        <TiltCard depth={5}>
          <div className="card glass-panel stat-card highlight-bronze" style={{ height: '100%' }}>
            <div className="stat-icon" style={{ background: 'rgba(140, 90, 60, 0.2)' }}><BarChart size={20} color="var(--accent-2)" /></div>
            <div className="stat-content">
              <div className="stat-label">Engagement</div>
              <div className="stat-value">{stats.engagementRate}</div>
              <div className="stat-trend positive">+2.1% week over week</div>
            </div>
          </div>
        </TiltCard>

        <TiltCard depth={5}>
          <div className="card glass-panel stat-card highlight-accent" style={{ height: '100%' }}>
            <div className="stat-icon" style={{ background: 'rgba(255, 248, 240, 0.1)' }}><Zap size={20} color="var(--text-primary)" /></div>
            <div className="stat-content">
              <div className="stat-label">Virality Score</div>
              <div className="stat-value">{stats.avgViralityScore}/100</div>
              <div className="stat-trend neutral">Stable</div>
            </div>
          </div>
        </TiltCard>

        <TiltCard depth={5}>
          <div className="card glass-panel stat-card highlight-amber" style={{ height: '100%' }}>
            <div className="stat-icon" style={{ background: 'rgba(192, 133, 82, 0.2)' }}><TrendingUp size={20} color="var(--accent)" /></div>
            <div className="stat-content">
              <div className="stat-label">Content Pieces</div>
              <div className="stat-value">{stats.contentPieces}</div>
              <div className="stat-trend negative">-5 from target</div>
            </div>
          </div>
        </TiltCard>
      </div>

      <div className="grid-2-1">
        {/* Main Chart */}
        <div className="card glass-panel">
          <div className="section-title">
            <TrendingUp size={18} />
            <span>Weekly Growth Tracking</span>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: 20 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.weeklyReach}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="reach" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Split / Recent Activity */}
        <div className="card glass-panel">
          <div className="section-title">
            <BarChart size={18} />
            <span>Platform Distribution</span>
          </div>
          <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.platformSplit}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.platformSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {stats.platformSplit.map((ps, i) => (
              <div key={i} className="legend-item">
                <span className="dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                <span>{ps.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent High Potentials */}
      <div className="card glass-panel">
        <div className="section-title">
          <Zap size={18} />
          <span>Recent High-Impact Content</span>
        </div>
        <div className="recent-activity-list">
          {stats.recentActivity.map((act) => (
            <div key={act.id} className="activity-row">
              <div className="activity-info">
                <div className={`activity-badge ${act.status}`}>{act.type}</div>
                <div className="activity-label">{act.label}</div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">{act.time}</span>
                <button className="btn btn-icon"><ExternalLink size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
