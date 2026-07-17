import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-3-5-sonnet-20240620"; // Adjusted for official model string

/**
 * Core helper – returns the text content from a Claude completion.
 */
async function complete(systemPrompt, userMessage, maxTokens = 1200) {
  if (process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here' || !process.env.ANTHROPIC_API_KEY) {
    console.log('Using mock AI response due to missing Anthropic key.');
    return generateLocalMock(systemPrompt);
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });
    return response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  } catch (error) {
    console.error('Claude API Error, falling back to mock:', error);
    return generateLocalMock(systemPrompt);
  }
}

/**
 * Generate full content piece (caption, hooks, hashtags, CTA) for a given platform.
 */
export async function generateContent({ topic, platform, niche, format, tone, audience }) {
  const system = `You are ViralIQ's AI content engine. You specialize in creating viral, 
algorithm-optimized content for ${platform}. Always respond with ONLY valid JSON matching 
the requested schema. No markdown fences, no extra text.`;

  const prompt = `Generate a high-virality ${format || 'Post'} content piece for the ${niche || topic} niche.

Details:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone || "authentic & engaging"}
- Target Audience: ${audience || "general"}

Return JSON with this exact schema:
{
  "title": "post title or hook headline",
  "hook": "opening line to stop the scroll (max 15 words)",
  "body": "full post body optimized for ${platform}",
  "cta": "call to action",
  "hashtags": ["#tag1", "#tag2"],
  "alt_hooks": ["hook variant 2", "hook variant 3"],
  "posting_tips": "brief platform-specific posting advice",
  "virality_score": 95,
  "virality_reasons": ["reason1", "reason2", "reason3"],
  "improvements": ["suggestion1", "suggestion2"]
}`;

  const raw = await complete(system, prompt, 1500);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/**
 * Predict virality score and provide improvement suggestions for existing content.
 */
export async function predictVirality({ content, platform, niche }) {
  const system = `You are ViralIQ's virality prediction model trained on millions of viral posts. 
Respond ONLY with valid JSON.`;

  const prompt = `Analyze this ${platform} post for virality potential in the ${niche} niche:

"${content}"

Return JSON:
{
  "virality_score": 85,
  "engagement_prediction": {
    "likes": "<estimated range>",
    "comments": "<estimated range>",
    "shares": "<estimated range>",
    "reach_multiplier": 10
  },
  "strengths": ["what works"],
  "weaknesses": ["what hurts performance"],
  "improvements": ["specific actionable improvements"],
  "rewritten_hook": "improved opening line",
  "best_posting_time": "e.g. Tuesday 7-9 PM",
  "algorithm_signals": {
    "hook_strength": 9,
    "retention_potential": 8,
    "shareability": 7,
    "comment_bait": 6
  }
}`;

  const raw = await complete(system, prompt, 1200);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/**
 * Analyze trends for a niche and return platform breakdowns.
 */
export async function analyzeTrends({ niche, platforms }) {
  const system = `You are ViralIQ's trend intelligence engine. You identify what is currently 
trending in any niche across social platforms. Respond ONLY with valid JSON.`;

  const prompt = `Analyze current trending content for the "${niche}" niche across these platforms: ${platforms.join(", ")}.

Simulate real trend data based on your knowledge of social media patterns, viral formats, 
and platform algorithms for ${niche}.

Return JSON:
{
  "trends": [
    {
      "platform": "Instagram",
      "hashtag": "#trending",
      "topic": "topic name",
      "velocity": "Viral",
      "impressions_24h": "1.2M",
      "content_angle": "recommended angle for this trend",
      "why_trending": "brief explanation"
    }
  ],
  "global_pulse": {
    "content_strategy_shift": "key shift happening now",
    "audience_attention_span": "current trend in seconds",
    "algorithm_primary_signal": "what algo rewards most now",
    "save_ratio_importance": "high"
  },
  "niche_insight": {
    "hook_type": "most effective hook type",
    "platform_winning": "platform with best reach for niche",
    "weekly_trend": "brief weekly observation",
    "recommendation": "full actionable recommendation paragraph"
  }
}`;

  const raw = await complete(system, prompt, 1500);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/**
 * Generate a viral strategy blueprint for a niche + goal.
 */
export async function generateStrategy({ niche, goal }) {
  const system = `You are ViralIQ's strategic growth advisor. You create data-driven viral 
content strategies. Respond ONLY with valid JSON.`;

  const prompt = `Create a complete viral content strategy for:
- Niche: ${niche}
- Primary Goal: ${goal}

Return JSON:
{
  "niche_analysis": "2-3 sentence analysis of the niche opportunity",
  "competitor_gaps": ["gap1", "gap2", "gap3"],
  "winning_angles": ["angle1", "angle2", "angle3"],
  "growth_roadmap": [
    { "week": "Week 1", "focus": "focus area", "tasks": ["task1", "task2"] },
    { "week": "Week 2", "focus": "focus area", "tasks": ["task1", "task2"] },
    { "week": "Week 3", "focus": "focus area", "tasks": ["task1", "task2"] }
  ],
  "content_pillars": [
    { "name": "pillar name", "platform": "Instagram/Reels", "frequency": "3x/week" },
    { "name": "pillar name", "platform": "LinkedIn", "frequency": "2x/week" },
    { "name": "pillar name", "platform": "Twitter/X", "frequency": "daily" }
  ],
  "platform_distribution": {
    "primary": "platform name",
    "secondary": "platform name",
    "repurposing_map": "how to repurpose content across platforms"
  },
  "best_posting_times": {
    "Instagram": "e.g. Tue/Thu 7-9 PM",
    "Twitter/X": "e.g. Mon-Fri 8 AM, 12 PM",
    "LinkedIn": "e.g. Tue/Wed 8-10 AM",
    "YouTube": "e.g. Sat 10 AM"
  },
  "unfair_advantage": "the unique edge this strategy gives the creator"
}`;

  const raw = await complete(system, prompt, 1800);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/**
 * Generate a week of content calendar entries.
 */
export async function generateCalendarWeek({ niche, platforms, goal }) {
  const system = `You are ViralIQ's content scheduling AI. Respond ONLY with valid JSON.`;

  const prompt = `Generate a strategic 7-day content calendar for:
- Niche: ${niche}
- Platforms: ${platforms.join(", ")}
- Goal: ${goal || "Viral Growth"}

Return JSON:
{
  "entries": [
    {
      "day": "Monday",
      "day_index": 0,
      "title": "post title",
      "platform": "Instagram",
      "format": "Reel",
      "status": "draft",
      "scheduled_time": "7:00 PM",
      "content_idea": "brief description of content",
      "hook": "opening hook",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "optimization_tip": "AI insight about the week schedule",
  "gap_detected": "day/time with missed opportunity"
}`;

  const raw = await complete(system, prompt, 1500);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/**
 * Generate SEO keywords + hashtag sets for a topic.
 */
export async function generateSEOKeywords({ topic, platform, niche }) {
  const system = `You are ViralIQ's SEO and hashtag optimization engine. Respond ONLY with valid JSON.`;

  const prompt = `Generate optimized SEO keywords and hashtag sets for:
- Topic: ${topic}
- Platform: ${platform}
- Niche: ${niche}

Return JSON:
{
  "primary_keywords": ["keyword1", "keyword2"],
  "long_tail_keywords": ["long tail 1", "long tail 2"],
  "hashtag_sets": {
    "viral": ["#tag1"],
    "niche": ["#tag1"],
    "community": ["#tag1"]
  },
  "seo_title": "optimized title",
  "meta_description": "optimized description",
  "content_gaps": ["opportunity1", "opportunity2"]
}`;

  const raw = await complete(system, prompt, 900);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}


/* --- FALLBACK AND MIGRATION ADAPTERS --- */

function generateLocalMock(systemPrompt) {
  if (systemPrompt.includes("scheduling")) {
    return JSON.stringify({
      entries: [
        { day: "Monday",    day_index: 0, title: "AI Productivity Hacks That Saved My Week",        platform: "LinkedIn",  format: "Carousel", status: "draft", scheduled_time: "9:00 AM",  content_idea: "Share 5 real AI tools with before/after productivity metrics", hook: "I saved 12 hours last week. Here's how.", hashtags: ["#AI", "#Productivity", "#LinkedIn"] },
        { day: "Tuesday",   day_index: 1, title: "Behind the Build: My AI Workflow",                platform: "Instagram", format: "Reel",     status: "draft", scheduled_time: "7:45 PM", content_idea: "Raw look at daily AI tool usage", hook: "Nobody shows you THIS side of AI content creation.", hashtags: ["#BehindTheScenes", "#ContentCreator", "#AITools"] },
        { day: "Wednesday", day_index: 2, title: "Hot Take: AI Won't Replace You — But This Will", platform: "Twitter/X", format: "Thread",   status: "draft", scheduled_time: "12:00 PM", content_idea: "Thread on skills that actually matter", hook: "Unpopular AI opinion: the real threat isn't AI.", hashtags: ["#AI", "#HotTake", "#FutureOfWork"] },
        { day: "Thursday",  day_index: 3, title: "Full AI Tool Breakdown (Watch This)",             platform: "YouTube",   format: "Short",    status: "draft", scheduled_time: "6:00 PM", content_idea: "60-second walkthrough of AI workflow", hook: "I tested 10 AI tools so you don't have to.", hashtags: ["#YouTube", "#AIReview", "#TechShort"] },
        { day: "Friday",    day_index: 4, title: "What I Wish I Knew Starting Out",                 platform: "Instagram", format: "Story",    status: "draft", scheduled_time: "8:00 AM",  content_idea: "Relatable early struggle → AI solution", hook: "My first month was a disaster. AI fixed it.", hashtags: ["#CreatorJourney", "#Motivation", "#Growth"] },
        { day: "Saturday",  day_index: 5, title: "Weekly AI Wins Recap — What Actually Worked",    platform: "Threads",   format: "Post",     status: "draft", scheduled_time: "11:00 AM", content_idea: "Honest weekly reflection with metrics", hook: "Week in review: what the algorithm rewarded.", hashtags: ["#WeeklyWrap", "#Threads", "#ContentStrategy"] },
        { day: "Sunday",    day_index: 6, title: "Plan Your Best Content Week Ever",                platform: "LinkedIn",  format: "Post",     status: "draft", scheduled_time: "7:00 PM", content_idea: "Content planning template + AI prompts", hook: "One Sunday to plan your entire week of viral content.", hashtags: ["#ContentPlanning", "#Strategy", "#LinkedIn"] }
      ],
      optimization_tip: "Peak engagement detected at **Tue 7:45 PM** (Instagram) and **Wed 12 PM** (Twitter/X). Front-load your best hooks on these slots for maximum reach.",
      gap_detected: "Sunday"
    });
  } else if (systemPrompt.includes("SEO")) {
    return JSON.stringify({ primary_keywords: ["auto"], long_tail_keywords: ["auto mock"], hashtag_sets: { viral: ["#v"], niche: ["#n"], community: ["#c"] }, seo_title: "Mock Title", meta_description: "Mock desc", content_gaps: ["Gap 1"] });
  } else if (systemPrompt.includes("trend")) {
    return JSON.stringify({ trends: [{ platform: "Instagram", hashtag: "#MockTrend", topic: "Mocking", velocity: "Viral", impressions_24h: "1.2M", content_angle: "How to use mocks", why_trending: "Because mocks are great." }], global_pulse: { content_strategy_shift: "Mocks are in", audience_attention_span: "6 seconds", algorithm_primary_signal: "Saves", save_ratio_importance: "high" }, niche_insight: { hook_type: "Controversial", platform_winning: "Instagram", weekly_trend: "More memes", recommendation: "Use memes." } });
  } else if (systemPrompt.includes("advisor")) {
    return JSON.stringify({ niche_analysis: "Mocks are useful.", competitor_gaps: ["No mocks"], winning_angles: ["Easy mocks"], growth_roadmap: [{ week: "Week 1", focus: "Mocks", tasks: ["Setup mocks"] }], content_pillars: [{ name: "Mocking", platform: "Instagram", frequency: "3x/week" }], platform_distribution: { primary: "Instagram", secondary: "Twitter/X", repurposing_map: "Auto script" }, best_posting_times: { Instagram: "Tue 7 PM" }, unfair_advantage: "We have mocks." });
  } else if (systemPrompt.includes("prediction model")) {
     return JSON.stringify({ virality_score: 85, engagement_prediction: { likes: "1K-5K", comments: "100-500", shares: "50-200", reach_multiplier: 12 }, strengths: ["Good hook"], weaknesses: ["Long body"], improvements: ["Shorten body"], rewritten_hook: "Stop scrolling!", best_posting_time: "Tue 7 PM", algorithm_signals: { hook_strength: 8, retention_potential: 7, shareability: 6, comment_bait: 9 } });
  }
  
  return JSON.stringify({
    title: "Viral Mock Post",
    hook: "Stop scrolling! This changes everything.",
    body: "Here is the explosive body content that will capture hearts.",
    cta: "Drop a comment below!",
    hashtags: ["#Viral", "#Growth", "#Success"],
    alt_hooks: ["Have you ever wondered?", "The secret is out."],
    posting_tips: "Post at 6:30 PM with a trending sound.",
    virality_score: 92,
    virality_reasons: ["Strong hook", "Emotional resonance"],
    improvements: ["Make it slightly shorter."]
  });
}

// ADAPTER: Bridging the new API seamlessly into the V1 Controllers!
export const generateViralContent = async (brief) => {
  const { topic, audience, goals, tone, platforms } = brief;
  
  const promises = platforms.map(async (platform) => {
    const res = await generateContent({
      topic,
      platform,
      niche: topic, 
      format: platform === 'Instagram' ? 'Reel' : 'Post',
      tone,
      audience
    });
    
    return {
      platform,
      hook: res.hook,
      body: res.body,
      cta: res.cta,
      hashtags: res.hashtags || [],
      format_tip: res.posting_tips,
      best_post_time: "Tuesday 6:30 PM",
      virality_score: {
        total: res.virality_score || 88,
        hookStrength: res.virality_score > 80 ? 22 : 15,
        emotionalTrigger: res.virality_score > 80 ? 20 : 12,
        trendAlignment: res.virality_score > 80 ? 24 : 14,
        ctaClarity: res.virality_score > 80 ? 22 : 18,
        score_label: res.virality_score >= 90 ? "Viral" : "Strong",
        improvement_tip: res.improvements?.[0] || 'Keep iterating.'
      }
    };
  });
  
  const generated_content = await Promise.all(promises);
  
  return {
    session: { topic, audience, goal: goals, tone, platforms_selected: platforms.length ? platforms : ['Instagram'] },
    generated_content,
    trending_hashtags: [
       { hashtag: `#${topic.replace(/[^a-zA-Z]/g, '')}Hacks`, relevance: 'High', reach_potential: 'Viral', content_angle: 'Myth busting' }
    ],
    ai_tip: `Analyze your ${platforms.join(', ')} audience before posting.`
  };
};
