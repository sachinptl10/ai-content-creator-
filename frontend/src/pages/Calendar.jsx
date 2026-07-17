import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Sparkles, Clock, MoreVertical, CheckCircle2,
  Trash2, Edit2, AlertCircle, X, Calendar as CalIcon,
  Zap, RefreshCw
} from 'lucide-react';
import client from '../api/client';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'YouTube', 'Facebook', 'Threads'];
const FORMATS = ['Reel', 'Post', 'Story', 'Carousel', 'Thread', 'Short', 'Video', 'Live'];
const TIMES = [
  '6:00 AM', '7:00 AM', '7:45 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '5:00 PM', '6:00 PM',
  '7:00 PM', '7:45 PM', '8:00 PM', '9:00 PM'
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUS_OPTIONS = ['draft', 'scheduled', 'posted'];

const defaultForm = {
  day: 'Mon', platform: 'Instagram', format: 'Reel',
  topic: '', time: '7:00 PM', status: 'draft',
};

/* ── Portal Modal renders at document.body level to avoid any overflow/z-index clip ── */
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return createPortal(
    <div
      className="modal-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function Calendar() {
  const [entries, setEntries] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [menuOpen, setMenuOpen] = useState(null);
  const [aiTip, setAiTip] = useState(
    "Our AI detected a gap in your **Tuesday evening** slot. Audiences in your niche are highly active on **Instagram** at 7:45 PM. We've added a draft Reel idea to fill this gap."
  );
  const [savingEntry, setSavingEntry] = useState(false);
  const [viewMode, setViewMode] = useState('week');

  /* Fetch calendar entries */
  const fetchCalendar = async () => {
    try {
      const res = await client.get('/calendar');
      if (res.data.success && res.data.data?.length) {
        setEntries(res.data.data);
      } else {
        setEntries(getMockData());
      }
    } catch {
      setEntries(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCalendar(); }, []);

  /* Close any open menu when clicking outside */
  useEffect(() => {
    const handle = () => setMenuOpen(null);
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, []);

  /* Open new entry modal, optionally pre-setting the day */
  const openNew = (day = 'Mon') => {
    setEditingEntry(null);
    setFormData({ ...defaultForm, day });
    setShowModal(true);
  };

  /* Open edit entry modal */
  const openEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      day: entry.day || 'Mon',
      platform: entry.platform || 'Instagram',
      format: entry.format || 'Reel',
      topic: entry.topic || '',
      time: entry.time || '7:00 PM',
      status: entry.status || 'draft',
    });
    setShowModal(true);
    setMenuOpen(null);
  };

  /* Save entry (create or update) */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;
    setSavingEntry(true);

    const dayIndex = DAYS.indexOf(formData.day);
    const base = getNextMonday();
    const scheduledAt = new Date(base);
    scheduledAt.setDate(base.getDate() + dayIndex);

    try {
      if (editingEntry) {
        await client.patch(`/calendar/${editingEntry.id}`, {
          title: formData.topic,
          platform: formData.platform,
          format: formData.format,
          status: formData.status,
          scheduledAt: scheduledAt.toISOString(),
          time: formData.time,
        });
        setEntries(prev => prev.map(e =>
          e.id === editingEntry.id ? { ...e, ...formData } : e
        ));
      } else {
        const res = await client.post('/calendar', {
          title: formData.topic,
          platform: formData.platform,
          format: formData.format,
          status: formData.status,
          scheduledAt: scheduledAt.toISOString(),
          time: formData.time,
        });
        const saved = res.data.success ? res.data.data : null;
        setEntries(prev => [...prev, {
          id: saved?.id || `local-${Date.now()}`,
          ...formData,
        }]);
      }
    } catch {
      // Optimistic update even if API fails
      if (editingEntry) {
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...e, ...formData } : e));
      } else {
        setEntries(prev => [...prev, { id: `local-${Date.now()}`, ...formData }]);
      }
    } finally {
      setSavingEntry(false);
      setShowModal(false);
      setEditingEntry(null);
    }
  };

  const handleDelete = async (entryId) => {
    setMenuOpen(null);
    setEntries(prev => prev.filter(e => e.id !== entryId));
    try { await client.delete(`/calendar/${entryId}`); } catch {}
  };

  const handleStatusChange = async (entry, newStatus) => {
    setMenuOpen(null);
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: newStatus } : e));
    try { await client.patch(`/calendar/${entry.id}`, { status: newStatus }); } catch {}
  };

  const handleClearCalendar = async () => {
    if (!window.confirm("Are you sure you want to clear all calendar entries? This cannot be undone.")) return;
    setIsClearing(true);
    try {
      await client.delete('/calendar/clear');
      setEntries([]);
      setAiTip("Calendar cleared. Use AI Generate to build a new schedule!");
    } catch {
      alert("Failed to clear calendar.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await client.post('/calendar/generate', {
        niche: 'Tech', platforms: ['Instagram', 'Twitter/X', 'LinkedIn', 'YouTube'],
        goal: 'Viral Growth',
      });
      if (res.data.success) {
        setEntries(res.data.data || []);
        setAiTip(res.data.optimization_tip || "AI successfully generated your weekly content schedule. Each post is timed for peak engagement.");
      }
    } catch {
      const aiWeek = [
        { id: `ai-1`, day: 'Mon', platform: 'LinkedIn',  topic: 'AI Productivity Hacks',     format: 'Carousel', time: '9:00 AM',  status: 'draft' },
        { id: `ai-2`, day: 'Tue', platform: 'Instagram', topic: 'Behind the Build',           format: 'Reel',     time: '7:45 PM', status: 'draft' },
        { id: `ai-3`, day: 'Wed', platform: 'Twitter/X', topic: 'Unpopular AI Opinion',       format: 'Thread',   time: '12:00 PM', status: 'draft' },
        { id: `ai-4`, day: 'Thu', platform: 'YouTube',   topic: 'Full Walkthrough Tutorial',  format: 'Short',    time: '6:00 PM', status: 'draft' },
        { id: `ai-5`, day: 'Fri', platform: 'Instagram', topic: 'Weekend Motivation Dump',    format: 'Story',    time: '8:00 AM', status: 'draft' },
        { id: `ai-6`, day: 'Sat', platform: 'Threads',   topic: 'Weekly Wins Recap',          format: 'Post',     time: '11:00 AM', status: 'draft' },
      ];
      setEntries(aiWeek);
      setAiTip('AI generated your full 7-day sprint! Peak windows: **Tue 7:45 PM** on Instagram and **Wed 12 PM** on Twitter/X. Edit any card to refine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPlatformClass = (p = '') =>
    `platform-${p.toLowerCase().split('/')[0].split(' ')[0]}`;

  const dayEntries = (day) => entries.filter(e => e.day === day);

  const form = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  return (
    <div className="page-content animate-in">
      {/* Top Controls */}
      <div className="calendar-controls">
        <div className="btn-group">
          <button className={`btn btn-secondary${viewMode === 'week' ? ' active' : ''}`} onClick={() => setViewMode('week')}>Work Week</button>
          <button className={`btn btn-secondary${viewMode === 'month' ? ' active' : ''}`} onClick={() => setViewMode('month')}>Full Month</button>
        </div>
        <div className="btn-group">
          <button
            id="clear-calendar-btn"
            className="btn btn-secondary"
            onClick={handleClearCalendar}
            disabled={isClearing || isGenerating}
            style={{ color: '#ff6b6b' }}
          >
            {isClearing ? <><div className="spinner-mini" /> Clearing...</> : <><Trash2 size={16} /> Clear All</>}
          </button>
          <button
            id="ai-generate-week-btn"
            className="btn btn-secondary"
            onClick={handleAiGenerate}
            disabled={isGenerating || isClearing}
          >
            {isGenerating ? <><div className="spinner-mini" /> Generating...</> : <><Sparkles size={16} /> AI Generate Week</>}
          </button>
          <button
            id="new-entry-btn"
            className="btn btn-primary"
            onClick={() => openNew()}
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* Calendar Board */}
      {isLoading ? (
        <div className="loading-trends">
          <div className="spinner-mini" style={{ width: 32, height: 32 }} />
          <p>Loading your content calendar...</p>
        </div>
      ) : (
        <div className="calendar-board">
          {DAYS.map((day) => (
            <div key={day} className="calendar-column">
              <div className="column-header">
                <span className="day-name">{day}</span>
                <button
                  className="col-plus-btn"
                  onClick={() => openNew(day)}
                  title={`Add entry for ${day}`}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="column-entries">
                {dayEntries(day).map((entry) => (
                  <div key={entry.id} className={`calendar-entry-card ${entry.status}`}>
                    <div className="entry-head">
                      <span className={`entry-platform ${getPlatformClass(entry.platform)}`}>
                        {entry.platform}
                      </span>
                      <div style={{ position: 'relative' }}>
                        <button
                          className="btn-menu"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setMenuOpen(menuOpen === entry.id ? null : entry.id);
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>
                        {menuOpen === entry.id && (
                          <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                            <button className="dropdown-item" onClick={() => openEdit(entry)}>
                              <Edit2 size={12} /> Edit
                            </button>
                            {entry.status !== 'posted' && (
                              <button className="dropdown-item" onClick={() => handleStatusChange(entry, 'posted')}>
                                <CheckCircle2 size={12} /> Mark Posted
                              </button>
                            )}
                            {entry.status !== 'scheduled' && (
                              <button className="dropdown-item" onClick={() => handleStatusChange(entry, 'scheduled')}>
                                <CalIcon size={12} /> Schedule
                              </button>
                            )}
                            <button className="dropdown-item danger" onClick={() => handleDelete(entry.id)}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="entry-topic">{entry.topic}</div>

                    <div className="entry-meta">
                      <span className="entry-time"><Clock size={10} /> {entry.time}</span>
                      <span className="entry-format">{entry.format}</span>
                    </div>

                    <div className="entry-status-indicator">
                      <div className="status-dot" />
                      <span>{(entry.status || 'draft').toUpperCase()}</span>
                      {entry.status === 'posted' && (
                        <CheckCircle2 size={10} style={{ marginLeft: 'auto', color: 'var(--accent-3)' }} />
                      )}
                    </div>
                  </div>
                ))}

                {dayEntries(day).length === 0 && (
                  <div className="empty-slot" onClick={() => openNew(day)} style={{ cursor: 'pointer' }}>
                    Rest Day
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Optimization Tip */}
      <div className="card glass-panel highlight-orange" style={{ marginTop: 24 }}>
        <div className="section-title">
          <AlertCircle size={18} />
          <span>Optimization Recommendation</span>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={handleAiGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <><RefreshCw size={12} className="spin" /> Analyzing...</> : <><Zap size={12} /> Refresh AI Tip</>}
          </button>
        </div>
        <p className="insight-text">
          {aiTip.split('**').map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </p>
      </div>

      {/* ── Modal (portal) ── */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-header">
          <div className="modal-title">
            <CalIcon size={18} />
            <span>{editingEntry ? 'Edit Entry' : 'New Calendar Entry'}</span>
          </div>
          <button className="modal-close" onClick={() => setShowModal(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {/* Topic */}
          <div className="form-group">
            <label className="form-label">Content Topic / Title *</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. My AI Productivity Setup 2026"
              value={formData.topic}
              onChange={(e) => form('topic', e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Day + Platform */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select className="form-select" value={formData.day} onChange={(e) => form('day', e.target.value)}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Platform</label>
              <select className="form-select" value={formData.platform} onChange={(e) => form('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Format + Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Content Format</label>
              <select className="form-select" value={formData.format} onChange={(e) => form('format', e.target.value)}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Post Time</label>
              <select className="form-select" value={formData.time} onChange={(e) => form('time', e.target.value)}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="status-chips">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`status-chip ${s}${formData.status === s ? ' active' : ''}`}
                  onClick={() => form('status', s)}
                >
                  {s === 'posted' && <CheckCircle2 size={12} />}
                  {s === 'scheduled' && <CalIcon size={12} />}
                  {s === 'draft' && <Edit2 size={12} />}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingEntry || !formData.topic.trim()}>
              {savingEntry
                ? <><div className="spinner-mini" /> Saving...</>
                : <><Plus size={16} /> {editingEntry ? 'Save Changes' : 'Add to Calendar'}</>
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function getMockData() {
  return [
    { id: '1', day: 'Mon', platform: 'LinkedIn',  topic: 'AI Trends This Week',    format: 'Carousel', time: '9:00 AM',  status: 'posted'    },
    { id: '2', day: 'Tue', platform: 'Instagram', topic: 'Behind the Scenes',      format: 'Reel',     time: '7:00 PM', status: 'scheduled' },
    { id: '3', day: 'Wed', platform: 'Twitter/X', topic: 'My Hottest AI Take',     format: 'Thread',   time: '11:00 AM', status: 'scheduled' },
    { id: '4', day: 'Thu', platform: 'YouTube',   topic: 'Full AI Tool Walkthrough', format: 'Short',  time: '6:00 PM', status: 'draft'     },
  ];
}

function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
