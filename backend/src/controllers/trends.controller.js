import { PrismaClient } from '@prisma/client';
import { analyzeTrends as requestAiTrends, generateViralContent as requestClaudeContent } from '../services/claude.service.js';

const prisma = new PrismaClient();
const PLATFORMS = ["Twitter/X", "Instagram", "LinkedIn", "YouTube", "Threads"];

export const analyzeCurrentTrends = async (req, res, next) => {
  try {
    const { niche, platforms } = req.query;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const targetNiche = niche || user.niche || "General";
    const targetPlatforms = platforms ? platforms.split(",") : PLATFORMS;

    // 1. Check Cache (15 min TTL)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const cached = await prisma.trendCache.findFirst({
      where: {
        niche: targetNiche,
        updatedAt: { gte: fifteenMinutesAgo }
      }
    });

    if (cached) {
      console.log(`📦 Serving cached trends for: ${targetNiche}`);
      return res.json({ success: true, data: JSON.parse(cached.data) });
    }

    // 2. Fresh AI Analysis
    const trendData = await requestAiTrends({ niche: targetNiche, platforms: targetPlatforms });

    // 3. Upsert Cache
    await prisma.trendCache.upsert({
      where: { niche: targetNiche },
      update: { data: JSON.stringify(trendData) },
      create: { niche: targetNiche, data: JSON.stringify(trendData) }
    });

    res.json({ success: true, data: trendData });
  } catch (err) {
    next(err);
  }
};

export const getHashtags = async (req, res, next) => {
  try {
    const { niche, platform } = req.query;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const targetNiche = niche || user.niche || "General";

    const hashtags = generatePlatformHashtags(targetNiche, platform || "Instagram");
    res.json({ success: true, data: hashtags });
  } catch (err) {
    next(err);
  }
};

export const draftFromTrend = async (req, res, next) => {
  try {
    const { hashtag, topic, platform, angle } = req.body;
    if (!topic || !platform) return res.status(400).json({ success: false, error: { message: "Topic and platform required" } });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const result = await requestClaudeContent({
      topic: `${angle || ""} ${topic}`.trim(),
      platform,
      audience: user.niche || "General",
      goals: "Viral Awareness",
      tone: "professional",
      platforms: [platform]
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// --- Utilities ---

function generatePlatformHashtags(niche, platform) {
  const base = {
    Tech: {
      Instagram: ["#TechLife", "#AITools", "#FutureOfWork", "#TechTips", "#Coding"],
      LinkedIn: ["#ArtificialIntelligence", "#TechLeadership", "#Innovation", "#FutureOfAI"],
      "Twitter/X": ["#AI", "#TechTwitter", "#BuildInPublic", "#OpenAI", "#LLM"],
      YouTube: ["#TechReview", "#AIExplained", "#CodingTutorial"],
    },
    Finance: {
      Instagram: ["#PersonalFinance", "#InvestingTips", "#WealthMindset"],
      LinkedIn: ["#FinTech", "#Investing", "#WealthManagement"],
    },
  };

  const nicheTags = base[niche]?.[platform] || [
    `#${niche}`,
    `#${niche}Tips`,
    `#${platform}${niche}`,
  ];

  return {
    platform,
    niche,
    trending: nicheTags.map((tag) => ({
      name: tag, // Match frontend expected data names
      posts: `${Math.floor(Math.random() * 900 + 100)}K`,
      velocity: ["🔥 Viral", "📈 Rising", "✅ Stable"][Math.floor(Math.random() * 3)],
    })),
  };
}
