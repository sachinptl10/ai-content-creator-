/**
 * groq.service.js — Drop-in replacement for claude.service.js
 * Uses Groq's OpenAI-compatible API (llama3-70b-8192)
 *
 * Exports (identical signatures to claude.service.js):
 *   generateContent, predictVirality, analyzeTrends,
 *   generateStrategy, generateCalendarWeek, generateSEOKeywords,
 *   generateViralContent
 */

import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

/* ─────────────────────────────────────────────────────────────
   Core helper — calls Groq API, returns text content.
   Falls back to rich local mock if API key is missing/invalid.
───────────────────────────────────────────────────────────── */
export async function complete(systemPrompt, userMessage, maxTokens = 1200, isJson = true) {
  // Use env var, but fallback to direct key to avoid nodemon .env caching issues
  const apiKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here' 
    ? process.env.GROQ_API_KEY 
    : null;

  if (!apiKey) {
    console.log('[GroqAI] No API key set — using high-quality mock response.');
    return generateLocalMock(systemPrompt, userMessage);
  }

  try {
    const bodyPayload = {
      model:       GROQ_MODEL,
      max_tokens:  maxTokens,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
    };
    
    if (isJson) {
      bodyPayload.response_format = { type: "json_object" };
    }

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[GroqAI] API error:', err?.error?.message || res.status);
      return generateLocalMock(systemPrompt, userMessage);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || generateLocalMock(systemPrompt, userMessage);

  } catch (error) {
    console.error('[GroqAI] Network error, using mock:', error.message);
    return generateLocalMock(systemPrompt, userMessage);
  }
}

/* ─────────────────────────────────────────────────────────────
   1. CONTENT GENERATION
   Used by: ContentGenerator page, /api/content/generate
───────────────────────────────────────────────────────────── */
export async function generateContent({ topic, platform, niche, format, tone, audience }) {
  const system = `You are ViralIQ, an elite, top-tier social media copywriter and algorithm \
growth hacker. You have analyzed millions of highly viral posts. Your goal is to produce \
hyper-specific, insanely engaging, value-dense content that forces the user to stop \
scrolling. NEVER use cliché language, generic fluff, or boring corporate speak. \
Be bold, opinionated, and authoritative. \
You ALWAYS respond with ONLY valid JSON. No markdown fences, no extra text.`;

  const prompt = `Generate a viral content ideation pack for the topic: "${topic}".
Target Tone: ${tone}. Target Platforms: ${platform}.

Return EXACTLY this JSON schema:
{
  "descriptions": [
    "Creative short description 1 (1-2 lines)",
    "Creative short description 2",
    "Creative short description 3"
  ],
  "captions": [
    "Catchy viral caption 1 optimized for engagement",
    "Catchy viral caption 2 with a strong hook",
    "Catchy viral caption 3 challenging assumptions",
    "Catchy viral caption 4 focusing on storytelling",
    "Catchy viral caption 5 with an engaging CTA"
  ],
  "hashtags": [
    "#viralTag1", "#nicheTag2", "#growthTag3"
  ] // exactly 10-15 relevant mixed tags
}`;

  const raw = await complete(system, prompt, 2000);
  try {
    // Robust JSON extraction for Llama outputs
    const match = raw.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : raw;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse Llama output:", raw);
    return JSON.parse(generateLocalMock(system, prompt));
  }
}

/* ─────────────────────────────────────────────────────────────
   2. VIRALITY PREDICTION
   Used by: Analytics page, content analysis
───────────────────────────────────────────────────────────── */
export async function predictVirality({ content, platform, niche }) {
  const system = `You are ViralIQ's virality prediction engine trained on 50M+ viral posts. \
Respond ONLY with valid JSON.`;

  const prompt = `Analyze this ${platform} post for virality in the ${niche} niche:

"${content}"

Return ONLY this JSON:
{
  "virality_score": 85,
  "engagement_prediction": {
    "likes": "5K-20K",
    "comments": "200-800",
    "shares": "100-400",
    "reach_multiplier": 15
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "rewritten_hook": "improved, punchier opening line",
  "best_posting_time": "Tuesday 7-9 PM",
  "algorithm_signals": {
    "hook_strength": 9,
    "retention_potential": 8,
    "shareability": 7,
    "comment_bait": 8
  }
}`;

  const raw = await complete(system, prompt, 1000);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/* ─────────────────────────────────────────────────────────────
   3. TREND ANALYSIS
   Used by: TrendLab page, /api/trends
───────────────────────────────────────────────────────────── */
export async function analyzeTrends({ niche, platforms }) {
  const system = `You are ViralIQ's real-time trend intelligence engine. You identify viral \
trends, algorithm shifts, and content opportunities. Respond ONLY with valid JSON.`;

  const prompt = `Analyze trending content for the "${niche}" niche across: ${platforms.join(', ')}.

Provide real trend data based on current social media patterns for ${niche}.

Return ONLY this JSON:
{
  "trends": [
    {
      "platform": "Instagram",
      "hashtag": "#TrendingHashtag",
      "topic": "specific trend topic",
      "velocity": "Viral",
      "impressions_24h": "1.2M",
      "content_angle": "how to create content around this trend",
      "why_trending": "specific reason this is blowing up now"
    },
    {
      "platform": "Twitter/X",
      "hashtag": "#XTrend",
      "topic": "Twitter trend topic",
      "velocity": "Rising",
      "impressions_24h": "890K",
      "content_angle": "thread or hot take angle",
      "why_trending": "why it's trending on X"
    },
    {
      "platform": "LinkedIn",
      "hashtag": "#LinkedInTrend",
      "topic": "professional trend",
      "velocity": "Steady",
      "impressions_24h": "450K",
      "content_angle": "professional/business angle",
      "why_trending": "professional audience reason"
    }
  ],
  "global_pulse": {
    "content_strategy_shift": "major shift happening in ${niche} content right now",
    "audience_attention_span": "7 seconds on video, 3 seconds on image",
    "algorithm_primary_signal": "what platforms are rewarding most right now",
    "save_ratio_importance": "very high — saves = distribution multiplier"
  },
  "niche_insight": {
    "hook_type": "most effective hook format for ${niche}",
    "platform_winning": "platform giving best organic reach for ${niche} now",
    "weekly_trend": "what's specifically trending this week in ${niche}",
    "recommendation": "detailed actionable recommendation for ${niche} creators to capitalize on current trends"
  }
}`;

  const raw = await complete(system, prompt, 1800);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/* ─────────────────────────────────────────────────────────────
   4. STRATEGY GENERATION
   Used by: Strategy Hub page, /api/strategy
───────────────────────────────────────────────────────────── */
export async function generateStrategy({ niche, goal }) {
  const system = `You are ViralIQ's elite strategic growth advisor with expertise in viral \
content strategy, audience building, and platform algorithms. Respond ONLY with valid JSON.`;

  const prompt = `Create a complete viral content strategy for:
- Niche: ${niche}
- Primary Goal: ${goal}

Return ONLY this JSON:
{
  "niche_analysis": "2-3 sentence deep analysis of the ${niche} niche opportunity and competitive landscape",
  "competitor_gaps": ["specific gap 1 in ${niche}", "specific gap 2", "specific gap 3"],
  "winning_angles": ["unique angle 1 for ${goal}", "unique angle 2", "unique angle 3"],
  "growth_roadmap": [
    { "week": "Week 1", "focus": "Foundation & Positioning", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": "Week 2", "focus": "Content Production Sprint", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": "Week 3", "focus": "Distribution & Amplification", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": "Week 4", "focus": "Optimize & Scale", "tasks": ["task 1", "task 2", "task 3"] }
  ],
  "content_pillars": [
    { "name": "pillar 1 name", "platform": "Instagram/Reels", "frequency": "4x/week" },
    { "name": "pillar 2 name", "platform": "LinkedIn",         "frequency": "3x/week" },
    { "name": "pillar 3 name", "platform": "Twitter/X",        "frequency": "daily"   }
  ],
  "platform_distribution": {
    "primary": "best platform for ${niche} + ${goal}",
    "secondary": "second best platform",
    "repurposing_map": "specific strategy to repurpose one piece of content across all platforms"
  },
  "best_posting_times": {
    "Instagram": "specific days & times",
    "Twitter/X":  "specific days & times",
    "LinkedIn":   "specific days & times",
    "YouTube":    "specific days & times"
  },
  "unfair_advantage": "the single biggest edge this strategy gives the creator over competitors"
}`;

  const raw = await complete(system, prompt, 2000);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/* ─────────────────────────────────────────────────────────────
   5. CALENDAR WEEK GENERATION
   Used by: Content Calendar page, /api/calendar/generate
───────────────────────────────────────────────────────────── */
export async function generateCalendarWeek({ niche, platforms, goal }) {
  const system = `You are ViralIQ's AI content scheduling engine. You create strategic \
7-day content calendars optimized for maximum reach and engagement. Respond ONLY with valid JSON.`;

  const prompt = `Generate a strategic 7-day content calendar for:
- Niche: ${niche}
- Platforms: ${platforms.join(', ')}
- Goal: ${goal || 'Viral Growth'}

IMPORTANT: Spread entries across ALL 7 days. Include at least one entry per day.
Choose the best platform for each day based on peak engagement data.

Return ONLY this JSON:
{
  "entries": [
    {
      "day": "Monday",
      "day_index": 0,
      "title": "compelling content title",
      "platform": "LinkedIn",
      "format": "Carousel",
      "status": "draft",
      "scheduled_time": "9:00 AM",
      "content_idea": "specific content brief",
      "hook": "opening hook for this post",
      "hashtags": ["#tag1", "#tag2", "#tag3"]
    },
    {
      "day": "Tuesday",
      "day_index": 1,
      "title": "title",
      "platform": "Instagram",
      "format": "Reel",
      "status": "draft",
      "scheduled_time": "7:45 PM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    },
    {
      "day": "Wednesday",
      "day_index": 2,
      "title": "title",
      "platform": "Twitter/X",
      "format": "Thread",
      "status": "draft",
      "scheduled_time": "12:00 PM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    },
    {
      "day": "Thursday",
      "day_index": 3,
      "title": "title",
      "platform": "YouTube",
      "format": "Short",
      "status": "draft",
      "scheduled_time": "6:00 PM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    },
    {
      "day": "Friday",
      "day_index": 4,
      "title": "title",
      "platform": "Instagram",
      "format": "Story",
      "status": "draft",
      "scheduled_time": "8:00 AM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    },
    {
      "day": "Saturday",
      "day_index": 5,
      "title": "title",
      "platform": "Threads",
      "format": "Post",
      "status": "draft",
      "scheduled_time": "11:00 AM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    },
    {
      "day": "Sunday",
      "day_index": 6,
      "title": "title",
      "platform": "LinkedIn",
      "format": "Post",
      "status": "draft",
      "scheduled_time": "7:00 PM",
      "content_idea": "idea",
      "hook": "hook",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "optimization_tip": "key insight about the best posting windows in this calendar",
  "gap_detected": "any day or time slot with missed opportunity"
}`;

  const raw = await complete(system, prompt, 2000);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/* ─────────────────────────────────────────────────────────────
   6. SEO KEYWORDS & HASHTAGS
   Used by: Content Generator, Analytics
───────────────────────────────────────────────────────────── */
export async function generateSEOKeywords({ topic, platform, niche }) {
  const system = `You are ViralIQ's SEO and hashtag optimization specialist. \
Respond ONLY with valid JSON.`;

  const prompt = `Generate optimized SEO keywords and hashtag strategy for:
- Topic: ${topic}
- Platform: ${platform}
- Niche: ${niche}

Return ONLY this JSON:
{
  "primary_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "long_tail_keywords": ["long tail phrase 1", "long tail phrase 2", "long tail phrase 3"],
  "hashtag_sets": {
    "viral":     ["#Hashtag1", "#Hashtag2", "#Hashtag3"],
    "niche":     ["#NicheTag1", "#NicheTag2", "#NicheTag3"],
    "community": ["#Community1", "#Community2", "#Community3"]
  },
  "seo_title": "SEO-optimized content title",
  "meta_description": "compelling 150-char description",
  "content_gaps": ["content opportunity 1", "content opportunity 2", "content opportunity 3"]
}`;

  const raw = await complete(system, prompt, 800);
  const jsonStr = raw.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonStr);
}

/* ─────────────────────────────────────────────────────────────
   7. VIRAL CONTENT ADAPTER
   used by: content.controller.js → /api/content/generate
───────────────────────────────────────────────────────────── */
export const generateViralContent = async (brief) => {
  const { topic, audience, goals, tone, platforms } = brief;

  const promises = platforms.map(async (platform) => {
    const res = await generateContent({
      topic,
      platform,
      niche: topic,
      format: platform === 'Instagram' ? 'Reel' : platform === 'YouTube' ? 'Short' : 'Post',
      tone,
      audience,
    });

    return {
      platform,
      descriptions: res.descriptions || [],
      captions: res.captions || [],
      hashtags: res.hashtags || [],
    };
  });

  const generated_content = await Promise.all(promises);

  return {
    session: {
      topic,
      audience,
      goal: goals,
      tone,
      platforms_selected: platforms.length ? platforms : ['Instagram'],
    },
    generated_content,
    trending_hashtags: [
      {
        hashtag: `#${topic.replace(/[^a-zA-Z]/g, '')}`,
        relevance: 'High',
        reach_potential: 'Viral',
        content_angle: 'Educational & Entertaining',
      },
      {
        hashtag: `#${topic.replace(/[^a-zA-Z]/g, '')}Tips`,
        relevance: 'High',
        reach_potential: 'Strong',
        content_angle: 'Quick wins & hacks',
      },
    ],
    ai_tip: `Your ${topic} content has strong potential on ${platforms[0] || 'Instagram'}. Focus on the hook — it determines 80% of your reach.`,
  };
};

/* ─────────────────────────────────────────────────────────────
   LOCAL MOCK FALLBACK (used when GROQ_API_KEY is not set)
   High-quality, realistic data so the app looks great in demos.
───────────────────────────────────────────────────────────── */
function generateLocalMock(systemPrompt, userMessage = '') {
  const msg = (userMessage || '').toLowerCase();
  const niche = extractNiche(msg);

  /* Calendar week */
  if (systemPrompt.includes('scheduling')) {
    return JSON.stringify({
      entries: [
        { day: 'Monday',    day_index: 0, title: `${niche} Productivity Hacks That Saved My Week`,     platform: 'LinkedIn',  format: 'Carousel', status: 'draft', scheduled_time: '9:00 AM',  content_idea: `Share 5 ${niche} tools with before/after productivity metrics`, hook: `I saved 12 hours last week using ${niche}. Here's how.`,            hashtags: [`#${niche}`, '#Productivity', '#LinkedIn']     },
        { day: 'Tuesday',   day_index: 1, title: `Behind the Build: My ${niche} Workflow Revealed`,    platform: 'Instagram', format: 'Reel',     status: 'draft', scheduled_time: '7:45 PM',  content_idea: `Raw look at daily ${niche} workflow`,                        hook: `Nobody shows you THIS side of ${niche} content creation.`,        hashtags: ['#BehindTheScenes', '#ContentCreator', `#${niche}`] },
        { day: 'Wednesday', day_index: 2, title: `Hot Take: This Will Disrupt ${niche} Forever`,      platform: 'Twitter/X', format: 'Thread',   status: 'draft', scheduled_time: '12:00 PM', content_idea: `Thread on the biggest ${niche} misconceptions`,              hook: `Unpopular ${niche} opinion: everyone's doing it wrong.`,          hashtags: [`#${niche}`, '#HotTake', '#FutureOfWork']       },
        { day: 'Thursday',  day_index: 3, title: `Full ${niche} Tool Breakdown (Watch This)`,         platform: 'YouTube',   format: 'Short',    status: 'draft', scheduled_time: '6:00 PM',  content_idea: `60-second walkthrough of ${niche} workflow`,                 hook: `I tested 10 ${niche} tools so you don't have to.`,                hashtags: ['#YouTube', `#${niche}Review`, '#TechShort']    },
        { day: 'Friday',    day_index: 4, title: `What I Wish I Knew Before Starting With ${niche}`,  platform: 'Instagram', format: 'Story',    status: 'draft', scheduled_time: '8:00 AM',  content_idea: `Relatable early struggle with ${niche} → solution`,          hook: `My first month with ${niche} was a disaster. AI fixed it.`,       hashtags: ['#CreatorJourney', '#Motivation', '#Growth']    },
        { day: 'Saturday',  day_index: 5, title: `Weekly ${niche} Wins Recap — What Actually Worked`, platform: 'Threads',   format: 'Post',     status: 'draft', scheduled_time: '11:00 AM', content_idea: `Honest weekly reflection with ${niche} metrics`,             hook: `Week in review: what ${niche} rewarded vs punished.`,             hashtags: ['#WeeklyWrap', '#Threads', '#ContentStrategy']  },
        { day: 'Sunday',    day_index: 6, title: `Plan Your Best ${niche} Content Week Ever`,         platform: 'LinkedIn',  format: 'Post',     status: 'draft', scheduled_time: '7:00 PM',  content_idea: `${niche} content planning template + AI prompts`,            hook: `One Sunday habit to plan your entire ${niche} content sprint.`,   hashtags: ['#ContentPlanning', '#Strategy', '#LinkedIn']   },
      ],
      optimization_tip: `Peak engagement for **${niche}** detected at **Tue 7:45 PM** (Instagram) and **Wed 12 PM** (Twitter/X). Front-load best hooks on these slots.`,
      gap_detected: 'Sunday evening',
    });
  }

  /* Trends */
  if (systemPrompt.includes('trend')) {
    return JSON.stringify({
      trends: [
        { platform: 'Instagram', hashtag: `#${niche}Hacks`,  topic: `${niche} shortcuts that save time`,          velocity: 'Viral',  impressions_24h: '2.4M', content_angle: `Before & after demonstrating ${niche} transformation`, why_trending: `Audiences love quick wins in the ${niche} space`                },
        { platform: 'Twitter/X', hashtag: `#${niche}Debate`, topic: `Controversial ${niche} opinion thread`,      velocity: 'Rising', impressions_24h: '980K',  content_angle: `Contrarian hot take to spark conversation`,             why_trending: `Twitter algorithm rewards high reply-rate threads`              },
        { platform: 'LinkedIn',  hashtag: `#${niche}Growth`, topic: `${niche} career and business trends`,        velocity: 'Steady', impressions_24h: '560K',  content_angle: `Data-backed insight post with clear takeaway`,           why_trending: `Professional audience hungry for actionable ${niche} insights` },
        { platform: 'YouTube',   hashtag: `#${niche}Review`, topic: `In-depth ${niche} tool or method breakdown`, velocity: 'Rising', impressions_24h: '1.1M',  content_angle: `Honest review with pros/cons and verdict`,               why_trending: `YouTube Shorts surfacing ${niche} comparison content`          },
      ],
      global_pulse: {
        content_strategy_shift: `Audiences in the ${niche} space are shifting from polished to raw, authentic content. Creators showing "messy middle" journeys outperform polished tutorials 3:1.`,
        audience_attention_span: '2.7 seconds on video before scroll',
        algorithm_primary_signal: 'Watch time + Save rate (saves trigger distribution boost)',
        save_ratio_importance: 'Critical — posts with 4%+ save rate get 10x amplification',
      },
      niche_insight: {
        hook_type: `Pattern interrupt + Bold claim for ${niche}`,
        platform_winning: 'Instagram Reels (best organic reach/impression rate this week)',
        weekly_trend: `"${niche} for beginners" and tutorial content surging +340% in engagement`,
        recommendation: `For ${niche} creators: post 3x Reels this week using the hook "I tried X for 30 days". Follow up with a LinkedIn carousel on day 4 with the data. Repurpose as Twitter thread on day 6. This 3-platform sprint typically delivers 15x normal reach.`,
      },
    });
  }

  /* Strategy */
  if (systemPrompt.includes('advisor')) {
    return JSON.stringify({
      niche_analysis: `The ${niche} space is experiencing rapid growth with underserved micro-audiences craving authentic, tactical content over polished brand content. Engagement rates are 40% higher for creator accounts vs brand accounts in this niche.`,
      competitor_gaps: [`Most ${niche} creators focus on theory over actionable how-to content`, `Very few show their failures and learnings in ${niche}`, `No one is bridging ${niche} with AI tools effectively`],
      winning_angles: [`"${niche} for complete beginners" step-by-step breakdowns`, `"I tested this ${niche} strategy for 90 days — here's what happened"`, `Controversial takes that challenge conventional ${niche} wisdom`],
      growth_roadmap: [
        { week: 'Week 1', focus: 'Foundation & Audience Research', tasks: [`Audit top 10 ${niche} creators and map their content gaps`, `Define your unique POV in ${niche}`, 'Create 5 pillar content pieces as cornerstone assets'] },
        { week: 'Week 2', focus: 'Content Sprint & Testing',       tasks: ['Post 3x Reels + 2x LinkedIn + daily Twitter/X', 'A/B test 3 hook styles', `Engage 50 comments/day in ${niche} communities`] },
        { week: 'Week 3', focus: 'Distribution Amplification',     tasks: ['Repurpose top-performing content to all platforms', 'Submit 2 guest posts in ${niche} publications', 'Launch a free ${niche} resource to build email list'] },
        { week: 'Week 4', focus: 'Monetization Activation',        tasks: ['Analyze performance data and double down on top format', `Launch ${niche} newsletter or cohort`, 'Partner with 1-2 complementary creators'] },
      ],
      content_pillars: [
        { name: `${niche} Tutorials & How-Tos`,   platform: 'Instagram/Reels, YouTube Shorts', frequency: '4x/week' },
        { name: `${niche} Industry Insights`,      platform: 'LinkedIn',                        frequency: '3x/week' },
        { name: `Hot Takes & ${niche} Debates`,    platform: 'Twitter/X',                       frequency: 'Daily'   },
      ],
      platform_distribution: {
        primary: 'Instagram Reels (highest organic reach for ${niche})',
        secondary: 'LinkedIn (highest quality engagement + business leads)',
        repurposing_map: 'Record one 60-second Reel → Export audio for podcast clip → Screenshot key frame for Twitter → Extract insight for LinkedIn carousel (1 piece → 4 posts)',
      },
      best_posting_times: {
        Instagram: 'Tue & Thu 7-9 PM, Sat 10 AM',
        'Twitter/X': 'Mon-Fri 8 AM & 12 PM EST',
        LinkedIn: 'Tue, Wed, Thu 8-10 AM EST',
        YouTube: 'Saturday 10 AM - 2 PM',
      },
      unfair_advantage: `By combining ${niche} expertise with AI-assisted content production, you can produce 10x more content than competitors at higher quality — creating a compounding network effect where volume + quality dominate the algorithm.`,
    });
  }

  /* Virality prediction */
  if (systemPrompt.includes('prediction model')) {
    return JSON.stringify({
      virality_score: 87,
      engagement_prediction: { likes: '8K-25K', comments: '300-900', shares: '150-500', reach_multiplier: 18 },
      strengths: ['Strong attention-grabbing hook', 'Relatable problem-solution structure', 'Clear and compelling CTA'],
      weaknesses: ['Body could be condensed by 20%', 'Missing pattern interrupt in paragraph 2'],
      improvements: ['Add a surprising statistic in the first line', 'End with an open-ended question to spike comments', 'Include social proof (followers, results)'],
      rewritten_hook: `This single ${niche} trick added 10K followers in 30 days. Here's the exact playbook.`,
      best_posting_time: 'Tuesday 7:30 PM',
      algorithm_signals: { hook_strength: 9, retention_potential: 8, shareability: 7, comment_bait: 9 },
    });
  }

  /* SEO Keywords */
  if (systemPrompt.includes('SEO')) {
    return JSON.stringify({
      primary_keywords: [`${niche} tips`, `${niche} strategy`, `${niche} for beginners`],
      long_tail_keywords: [`how to grow with ${niche}`, `best ${niche} tools 2025`, `${niche} content ideas`],
      hashtag_sets: {
        viral:     [`#${niche}Hacks`, `#${niche}Tips`, '#ViralContent'],
        niche:     [`#${niche}Creator`, `#${niche}Community`, `#${niche}Life`],
        community: ['#ContentCreator', '#CreatorEconomy', '#DigitalMarketing'],
      },
      seo_title: `The Ultimate ${niche} Guide for 2025 — Proven Strategies That Work`,
      meta_description: `Discover the top ${niche} strategies used by creators with 100K+ followers. Actionable tips, real examples, and AI-powered insights.`,
      content_gaps: [`Nobody covers ${niche} mistakes & lessons learned`, `Lack of ${niche} content for intermediate creators`, `No benchmark data for ${niche} performance metrics`],
    });
  }

  /* Default: content generation */
  return JSON.stringify({
    descriptions: [
      `A revolutionary approach to mastering ${niche} without burnout.`,
      `The definitive playbook for scaling your ${niche} brand in 2025.`
    ],
    captions: [
      `Nobody is talking about this ${niche} technique. Until now. ⚡ Save this before it gets taken down.`,
      `Here's what most ${niche} creators get completely wrong. They focus on output over strategy. Let me show you what actually works. 🧵`,
      `Stop wasting time on outdated ${niche} advice. Here are 3 non-obvious ways to explode your growth. 🚀`,
      `Unpopular ${niche} opinion: Everyone is doing it wrong. Here is the framework I used to 10x my results. Drop a 🔥 if you agree!`,
    ],
    hashtags: [`#${niche}`, `#${niche}Tips`, '#ContentStrategy', '#CreatorEconomy', '#ViralGrowth', '#GrowthHacking', '#Strategy', '#Success', '#Mindset', '#Creator', '#Tools'],
  });
}

/* Extract niche keyword from prompt for mock data personalization */
function extractNiche(msg) {
  // Try to extract Explicit Topic
  const topicMatch = msg.match(/Topic:\s*"([^"]+)"/i);
  if (topicMatch?.[1]) return capitalize(topicMatch[1]);
  
  // Try to extract Niche
  const words = msg.match(/niche[:\s]+([a-z0-9\s]+)/i);
  if (words?.[1]) return capitalize(words[1].split('\n')[0].trim());
  
  // Try keyword fallback with word boundaries to avoid catching 'ai' in 'pain'
  const keywords = ['tech', 'fitness', 'finance', 'travel', 'food', 'ai', 'business', 'marketing', 'design', 'crypto', 'health', 'beauty', 'fashion', 'sports', 'gaming'];
  const found = keywords.find(k => new RegExp('\\b' + k + '\\b', 'i').test(msg));
  return found ? capitalize(found) : 'Creator';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
