import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar as CalendarIcon, 
  Flame, 
  LayoutDashboard, 
  LogOut, 
  PlusCircle, 
  Target,
  Bot,
  X,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',         icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { id: 'generator',  label: 'Content Generator', icon: <PlusCircle size={20} />,     path: '/generator', badge: 'AI' },
  { id: 'trends',     label: 'Trend Lab',          icon: <Flame size={20} />,           path: '/trends' },
  { id: 'analytics',  label: 'Analytics',          icon: <BarChart3 size={20} />,       path: '/analytics' },
  { id: 'calendar',   label: 'Content Calendar',  icon: <CalendarIcon size={20} />,    path: '/calendar' },
  { id: 'strategy',   label: 'Strategy Hub',      icon: <Target size={20} />,          path: '/strategy' },
  { id: 'ai',         label: 'AI Assistant',      icon: <Bot size={20} />,             path: '/ai', badge: '✨' },
];

export default function Sidebar({ active, isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    if (setIsOpen) setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-logo">
        <div className="logo-icon"><Sparkles size={20} /></div>
        <div style={{ flex: 1 }}>
          <div className="logo-text">ContentCraft</div>
          <div className="logo-badge">AI Engine</div>
        </div>
        <button
          className="mobile-close-btn"
          onClick={() => setIsOpen && setIsOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="nav-section">
        <div className="nav-label">Navigation</div>

        {NAV_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.path)}
            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, z: 10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            role="button"
            tabIndex={0}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="nav-icon" style={{ transform: 'translateZ(10px)' }}>{item.icon}</span>
            <span style={{ flex: 1, transform: 'translateZ(5px)' }}>{item.label}</span>
            {item.badge && <span className="nav-badge" style={{ transform: 'translateZ(15px)' }}>{item.badge}</span>}
          </motion.div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <div
            className="nav-item logout-btn"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
          >
            <span className="nav-icon"><LogOut size={20} /></span>
            <span>Logout</span>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => navigate('/settings')}>
          <div className="user-avatar-wrap">
            <div className="user-avatar">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="user-status-dot" />
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Creator Pro'}</div>
            <div className="user-plan">{user?.plan?.toUpperCase() || 'FREE'} · {user?.credits || 0} CR</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
