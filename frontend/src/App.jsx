import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import TrendLab from './pages/TrendLab';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Strategy from './pages/Strategy';
import Login from './pages/Login';
import Register from './pages/Register';
import AIAssistant from './pages/AIAssistant';

const PAGE_META = {
  dashboard:  { title: 'Dashboard',          sub: 'Your real-time virality command center',         icon: '⚡' },
  generator:  { title: 'Content Generator',  sub: 'AI-powered viral content for every platform',    icon: '✨' },
  trends:     { title: 'Trend Lab',           sub: 'Live trending hashtags, audio & keyword signals', icon: '🔥' },
  analytics:  { title: 'Analytics',           sub: 'Deep-dive into performance & audience data',     icon: '📊' },
  calendar:   { title: 'Content Calendar',    sub: 'Plan and schedule your 7-day content sprint',   icon: '📅' },
  strategy:   { title: 'Strategy Hub',        sub: 'Platform-specific playbooks & repurposing maps', icon: '🎯' },
  ai:         { title: 'AI Assistant',         sub: 'Your intelligent ViralIQ AI command center',     icon: '🤖' },
};

const ProtectedRoute = ({ children, pageKey }) => {
  const { isAuthenticated, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  if (loading) return <div className="loading-screen">⚡</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  const meta = PAGE_META[pageKey] || { title: 'ViralIQ', sub: '', icon: '✨' };

  return (
    <div className="shell">
      <div className={`sidebar-overlay ${menuOpen ? 'mobile-open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <Sidebar active={pageKey} isOpen={menuOpen} setIsOpen={setMenuOpen} />

      <div className="main">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="topbar-title">
            <h2>{meta.icon} {meta.title}</h2>
            <p className="subtitle-text">{meta.sub}</p>
          </div>
          <div className="topbar-actions">
            <div className="live-badge">
              <div className="status-dot"></div>
              Live Data
            </div>
            <div className="icon-btn" title="Notifications">🔔</div>
            <div className="icon-btn" title="Settings">⚙️</div>
            <div className="user-avatar-mini" title="Profile">U</div>
          </div>
        </header>

        <div className="page-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={pageKey}
              initial={{ opacity: 0, rotateX: -20, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: 20, y: -40, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top center', width: '100%', height: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Intelligent Root Dispatcher
const RootRoute = () => {
  // Always send to login first as per explicit user request
  return <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Area */}
          <Route path="/dashboard" element={<ProtectedRoute pageKey="dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/generator" element={<ProtectedRoute pageKey="generator"><ContentGenerator /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute pageKey="trends"><TrendLab /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute pageKey="analytics"><Analytics /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute pageKey="calendar"><Calendar /></ProtectedRoute>} />
          <Route path="/strategy" element={<ProtectedRoute pageKey="strategy"><Strategy /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute pageKey="ai"><AIAssistant /></ProtectedRoute>} />

          {/* Intelligent Fallback */}
          <Route path="/" element={<RootRoute />} />
          <Route path="*" element={<RootRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
