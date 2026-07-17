import { PrismaClient } from '@prisma/client';
import { 
  generateViralContent as requestClaudeContent,
  predictVirality as requestViralityPrediction,
  generateSEOKeywords as requestSEOKeywords
} from '../services/groq.service.js';

const prisma = new PrismaClient();

export const generate = async (req, res, next) => {
  const { topic, audience, goals, tone, platforms, format, niche } = req.body;
  const userId = req.user.id;

  if (!topic || !platforms || !Array.isArray(platforms)) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Topic and platforms are required' }
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return res.status(429).json({
        success: false,
        error: { code: 'INSUFFICIENT_CREDITS', message: 'Insufficient credits. Upgrade to Pro for more.' }
      });
    }

    // Call adapter from upgraded Claude Service
    const result = await requestClaudeContent({ 
      topic, 
      audience: audience || user.niche || 'General', 
      goals: goals || 'Viral Growth', 
      tone: tone || 'professional', 
      platforms 
    });

    // Save with Prisma Transaction (Pivot: Storing Pro metadata in 'result' to bypass old client limits)
    const [updatedUser, savedContent] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      }),
      prisma.content.create({
        data: {
          userId,
          topic,
          niche: audience || user.niche || 'General', // Fallback to niche for now
          platform: platforms[0], // Primary platform
          result: JSON.stringify({
            ...result,
            meta: { audience, goals, tone, platforms }
          }),
          viralityScore: result.generated_content?.[0]?.virality_score?.total || 0
        }
      })
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: savedContent.id,
        content: result,
        remainingCredits: updatedUser.credits
      }
    });
  } catch (error) {
    console.error('Content Generation Error:', error);
    next(error);
  }
};

export const predictVirality = async (req, res, next) => {
  try {
    const { content, platform, niche } = req.body;
    if (!content || !platform) {
      return res.status(400).json({ success: false, error: { message: 'Content and platform required' } });
    }
    const result = await requestViralityPrediction({ content, platform, niche: niche || 'General' });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getSEOKeywords = async (req, res, next) => {
  try {
    const { topic, platform, niche } = req.body;
    if (!topic) return res.status(400).json({ success: false, error: { message: 'Topic is required' } });

    const result = await requestSEOKeywords({
      topic,
      platform: platform || 'Instagram',
      niche: niche || 'General',
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { platform, limit = 20, offset = 0 } = req.query;

    const where = { userId: req.user.id };
    if (platform) where.platform = platform;

    const history = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const data = history.map(h => {
      let parsedResult = null;
      try { parsedResult = h.result ? JSON.parse(h.result) : null; } catch {}
      let parsedPlatforms = [];
      try { parsedPlatforms = h.platforms ? JSON.parse(h.platforms) : (h.platform ? [h.platform] : []); } catch {}

      return {
        ...h,
        platforms: parsedPlatforms,
        result: parsedResult
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getContentDetail = async (req, res, next) => {
  try {
    const content = await prisma.content.findUnique({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!content) return res.status(404).json({ success: false, error: { message: 'Content not found' } });

    res.status(200).json({
      success: true,
      data: {
        ...content,
        platforms: JSON.parse(content.platforms),
        result: typeof content.result === 'string' ? JSON.parse(content.result) : content.result
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    const { topic, result, viralityScore } = req.body;
    const updated = await prisma.content.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        topic,
        result: typeof result === 'object' ? JSON.stringify(result) : result,
        viralityScore
      }
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    await prisma.content.delete({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
