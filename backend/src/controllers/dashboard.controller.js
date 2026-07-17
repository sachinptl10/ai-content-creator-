import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Real DB Counts
    const [totalContent, upcomingCount, recentContent] = await prisma.$transaction([
      prisma.content.count({ where: { userId } }),
      prisma.calendarEntry.count({ 
        where: { 
          userId, 
          status: { in: ['scheduled', 'draft'] },
          scheduledAt: { gt: new Date() }
        } 
      }),
      prisma.content.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Simulated/Calculated Metrics
    const reach = 1240000 + Math.floor(Math.random() * 50000);
    const engagementRate = (5.8 + Math.random() * 0.5).toFixed(1);
    const viralityScore = 78 + Math.floor(Math.random() * 5);

    // Weekly growth mapping for AreaChart
    const days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
    const weeklyGrowth = days.map((day) => ({
      name: day,
      reach: Math.floor(100000 + Math.random() * 200000),
      engagement: parseFloat((4 + Math.random() * 3).toFixed(2)),
    }));

    // Platform distribution for PieChart
    const platformDistribution = [
      { name: "Instagram", value: 40, color: "#E1306C" },
      { name: "Twitter/X", value: 25, color: "#1DA1F2" },
      { name: "LinkedIn", value: 20, color: "#0A66C2" },
      { name: "YouTube", value: 15, color: "#FF0000" },
    ];

    res.json({
      success: true,
      data: {
        totalReach: `${(reach / 1000000).toFixed(2)}M`,
        reachChange: "+12.4%",
        engagementRate: `${engagementRate}%`,
        engagementChange: "+2.1%",
        avgViralityScore: viralityScore,
        viralityStatus: "Steady growth",
        contentPieces: totalContent,
        upcomingEvents: upcomingCount,
        weeklyReach: weeklyGrowth,
        platformSplit: platformDistribution,
        recentActivity: recentContent.map(c => ({
          id: c.id,
          type: 'Generation',
          label: c.topic,
          time: 'Today',
          status: 'success'
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res) => {
  const notifications = [
    { id: 1, type: "trend", message: "🔥 #AIRevolution is trending in your niche", time: "2m ago", read: false },
    { id: 2, type: "tip", message: "📈 Your Tuesday post got 3x average engagement", time: "1h ago", read: false },
    { id: 3, type: "schedule", message: "📅 Reminder: Instagram Reel scheduled for 7 PM", time: "3h ago", read: true },
  ];
  res.json({ success: true, data: notifications });
};
