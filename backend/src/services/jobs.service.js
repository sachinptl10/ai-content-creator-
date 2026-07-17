import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { analyzeTrends } from './groq.service.js';

const prisma = new PrismaClient();

const COMMON_NICHES = ['Tech', 'Finance', 'Fitness', 'Fashion', 'Food', 'Travel', 'Business'];
const PLATFORMS = ['Twitter/X', 'Instagram', 'LinkedIn', 'YouTube', 'Threads'];

/**
 * Refresh trend cache every 30 minutes for active niches.
 */
export function startTrendRefreshJob(io) {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Trend cache refresh started...');
    
    try {
      // Get active niches from users
      const userNiches = await prisma.user.findMany({
        where: { niche: { not: null } },
        select: { niche: true },
        distinct: ['niche']
      });

      const targets = [...new Set([...userNiches.map(u => u.niche), ...COMMON_NICHES])];

      for (const niche of targets) {
        try {
          const trendData = await analyzeTrends({ niche, platforms: PLATFORMS });
          
          await prisma.trendCache.upsert({
            where: { niche },
            update: { data: JSON.stringify(trendData) },
            create: { niche, data: JSON.stringify(trendData) }
          });

          // Emit to subscribed clients
          if (io) {
            io.to(`trends:${niche}`).emit('trend:update', { niche, data: trendData });
          }

          console.log(`✅ Trends refreshed for niche: ${niche}`);
        } catch (err) {
          console.error(`❌ Failed to refresh trends for ${niche}:`, err.message);
        }
      }
    } catch (error) {
      console.error('❌ Trend Job Fatal Error:', error);
    }
  });
}

/**
 * Check for upcoming scheduled posts and send reminders every hour.
 */
export function startScheduleReminderJob(io) {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const upcomingEntries = await prisma.calendarEntry.findMany({
        where: {
          status: 'scheduled',
          scheduledAt: {
            gte: now,
            lte: oneHourLater
          }
        },
        include: { user: true }
      });

      for (const entry of upcomingEntries) {
        if (io) {
          io.to(`user:${entry.userId}`).emit('schedule:reminder', {
            entryId: entry.id,
            title: entry.title,
            platform: entry.platform,
            scheduledAt: entry.scheduledAt,
          });
        }
      }

      if (upcomingEntries.length > 0) {
        console.log(`📅 Sent ${upcomingEntries.length} schedule reminders`);
      }
    } catch (error) {
      console.error('❌ Reminder Job Fatal Error:', error);
    }
  });
}
