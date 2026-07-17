import { PrismaClient } from '@prisma/client';
import { generateCalendarWeek as requestAiCalendar } from '../services/groq.service.js';

const prisma = new PrismaClient();

// Day names for converting day_index → day abbreviation
const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getCalendar = async (req, res) => {
  try {
    const { start, end } = req.query;
    const userId = req.user.id;

    let where = { userId };
    if (start || end) {
      where.scheduledAt = {};
      if (start) where.scheduledAt.gte = new Date(start);
      if (end) where.scheduledAt.lte = new Date(end);
    }

    const entries = await prisma.calendarEntry.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
    });

    // Map to frontend shape
    const data = entries.map(e => ({
      id: e.id,
      day: DAY_ABBR[new Date(e.scheduledAt).getDay() === 0 ? 6 : new Date(e.scheduledAt).getDay() - 1],
      platform: e.platform || 'Instagram',
      topic: e.title,
      format: e.format || 'Post',
      time: e.note?.split('|')[0]?.trim() || '7:00 PM',
      status: e.status
    }));

    if (data.length === 0) {
      return res.json({ success: true, data: getMockWeek() });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Get calendar error:', err);
    res.json({ success: true, data: getMockWeek() });
  }
};

export const createCalendarEntry = async (req, res) => {
  try {
    const { title, platform, format, status, scheduledAt, time, hookIdea, tone } = req.body;
    const userId = req.user.id;

    const entry = await prisma.calendarEntry.create({
      data: {
        userId,
        title: title || 'Untitled Post',
        platform: platform || 'Instagram',
        format: format || 'Post',
        status: status || 'draft',
        scheduledAt: new Date(scheduledAt || Date.now()),
        // We'll store the post time and hook idea in the note field as a compact format
        note: `${time || '9:00 AM'} | ${hookIdea || ''}`,
      },
    });

    const day = DAY_ABBR[new Date(entry.scheduledAt).getDay() === 0 ? 6 : new Date(entry.scheduledAt).getDay() - 1];

    res.status(201).json({
      success: true,
      data: {
        id: entry.id,
        day,
        platform: entry.platform,
        topic: entry.title,
        format: entry.format,
        time: time || '9:00 AM',
        status: entry.status
      }
    });
  } catch (err) {
    console.error('Create calendar entry error:', err);
    res.status(500).json({ success: false, error: { message: 'Failed to create entry' } });
  }
};

export const generateCalendar = async (req, res) => {
  try {
    const { niche, platforms, goal, week_start } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const result = await requestAiCalendar({
      niche: niche || user.niche || 'General',
      platforms: platforms || ['Instagram', 'Twitter/X', 'LinkedIn', 'YouTube'],
      goal: goal || 'Viral Growth',
    });

    const start = week_start ? new Date(week_start) : getNextMonday();
    const savedEntries = [];

    for (const entry of (result.entries || [])) {
      const entryDate = new Date(start);
      const dayIndex = typeof entry.day_index === 'number' ? entry.day_index : DAY_ABBR.indexOf(entry.day?.slice(0, 3));
      entryDate.setDate(start.getDate() + Math.max(0, dayIndex));

      const saved = await prisma.calendarEntry.create({
        data: {
          userId,
          title: entry.title || entry.topic || 'New Post',
          platform: entry.platform || 'Instagram',
          format: entry.format || 'Post',
          status: 'draft',
          scheduledAt: entryDate,
          note: `${entry.scheduled_time || '7:00 PM'} | ${entry.hook || entry.content_idea || ''}`,
        }
      });

      savedEntries.push({
        id: saved.id,
        day: DAY_ABBR[new Date(saved.scheduledAt).getDay() === 0 ? 6 : new Date(saved.scheduledAt).getDay() - 1],
        platform: saved.platform,
        topic: saved.title,
        format: saved.format,
        time: entry.scheduled_time || '7:00 PM',
        status: saved.status
      });
    }

    res.json({
      success: true,
      data: savedEntries,
      optimization_tip: result.optimization_tip || '',
      gap_detected: result.gap_detected || ''
    });
  } catch (err) {
    console.error('Generate calendar error:', err);
    res.status(500).json({ success: false, error: { message: 'Failed to generate calendar week' } });
  }
};

export const updateCalendarEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, platform, format, status, scheduledAt, time, hookIdea } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (platform) updateData.platform = platform;
    if (format) updateData.format = format;
    if (status) updateData.status = status;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (time || hookIdea) updateData.note = `${time || '9:00 AM'} | ${hookIdea || ''}`;

    const updated = await prisma.calendarEntry.update({
      where: { id, userId: req.user.id },
      data: updateData
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update calendar entry error:', err);
    res.status(500).json({ success: false, error: { message: 'Failed to update entry' } });
  }
};

export const deleteCalendarEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.calendarEntry.delete({ where: { id, userId: req.user.id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete calendar entry error:', err);
    res.status(500).json({ success: false, error: { message: 'Failed to delete entry' } });
  }
};

export const clearCalendar = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.calendarEntry.deleteMany({ where: { userId } });
    res.json({ success: true });
  } catch (err) {
    console.error('Clear calendar error:', err);
    res.status(500).json({ success: false, error: { message: 'Failed to clear calendar' } });
  }
};

// --- Utilities ---

function getNextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMockWeek() {
  return [
    { id: '1', day: 'Mon', platform: 'LinkedIn', topic: 'AI Trends', format: 'Carousel', time: '9:00 AM', status: 'posted' },
    { id: '2', day: 'Tue', platform: 'Instagram', topic: 'Behind the Scenes', format: 'Reel', time: '7:00 PM', status: 'scheduled' },
    { id: '3', day: 'Wed', platform: 'Twitter/X', topic: 'Hot Take', format: 'Thread', time: '11:00 AM', status: 'scheduled' },
    { id: '4', day: 'Thu', platform: 'YouTube', topic: 'Full Walkthrough', format: 'Short', time: '6:00 PM', status: 'draft' },
  ];
}
