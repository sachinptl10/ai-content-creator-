import { PrismaClient } from '@prisma/client';
import { generateStrategy as requestClaudeStrategy } from '../services/groq.service.js';

const prisma = new PrismaClient();

export const generate = async (req, res, next) => {
  const { niche, goal } = req.body;
  const userId = req.user.id;

  if (!niche || !goal) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Niche and goal are required' }
    });
  }

  try {
    // 1. Credit Check (Strategy costs 2 credits)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < 2) {
      return res.status(402).json({ 
        success: false, 
        error: { message: "Insufficient credits. Strategy generation requires 2 credits." } 
      });
    }

    // 2. Generate with AI
    const result = await requestClaudeStrategy({ niche, goal });

    // 3. Save & Deduct Credits in Transaction
    const [updatedUser, savedBlueprint] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 2 } }
      }),
      prisma.strategyBlueprint.create({
        data: {
          userId,
          niche,
          goal,
          blueprint: JSON.stringify(result)
        }
      })
    ]);

    res.status(201).json({
      success: true,
      data: {
        id: savedBlueprint.id,
        niche: savedBlueprint.niche,
        goal: savedBlueprint.goal,
        ...result,
        remainingCredits: updatedUser.credits
      }
    });
  } catch (error) {
    console.error('Strategy Generation Error:', error);
    next(error);
  }
};

export const getAllStrategies = async (req, res, next) => {
  try {
    const blueprints = await prisma.strategyBlueprint.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        niche: true,
        goal: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: blueprints });
  } catch (error) {
    next(error);
  }
};

export const getStrategyDetail = async (req, res, next) => {
  try {
    const row = await prisma.strategyBlueprint.findUnique({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!row) return res.status(404).json({ success: false, error: { message: 'Blueprint not found' } });

    res.status(200).json({
      success: true,
      data: {
        id: row.id,
        niche: row.niche,
        goal: row.goal,
        ...JSON.parse(row.blueprint),
        createdAt: row.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStrategy = async (req, res, next) => {
  try {
    await prisma.strategyBlueprint.delete({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
