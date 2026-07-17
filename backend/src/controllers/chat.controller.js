import { complete } from '../services/groq.service.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are ViralIQ, an elite, top-tier social media AI assistant. 
You are speaking directly to a user in a "Neural Chat" terminal.
Your tone is bold, highly strategic, cyberpunk-esque, and data-driven. 
You keep your answers concise, actionable, and punchy. You do NOT use markdown formatting like **bold** excessively—instead, use ALL CAPS for emphasis sparingly. 
You act as a digital growth hacker providing raw, unfiltered algorithmic truths.`;

    // false = do not force JSON response
    const reply = await complete(systemPrompt, message, 800, false);

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};
