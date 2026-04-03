// ViralIQ Mock AI Engine — implements all ViralIQ system prompt logic

const TRENDS = {
  Instagram: ['#ReelsViral', '#AIContent', '#TrendAlert2026', '#CreatorEconomy', '#VisualStorytelling'],
  'Twitter/X': ['#HotTake', '#AITech', '#FounderLife', '#BuildInPublic', '#ThreadAlert'],
  LinkedIn: ['#GrowthHacking', '#StartupLife', '#AIMarketing', '#PersonalBranding', '#B2BContent'],
  YouTube: ['#ShortsViral', '#ContentCreator', '#AlgorithmHacks', '#YouTubeGrowth', '#ViralShort'],
  Facebook: ['#CommunityBuilding', '#SmallBusiness', '#ViralPost', '#Engagement', '#SocialMedia'],
  Threads: ['#ThreadsViral', '#Opinions', '#CreatorTips', '#GenZ', '#HotOpinion'],
};

const HOOKS_BY_TONE = {
  Witty:        (topic, audience) => `I told ${audience} to try ${topic}. They laughed. Then their numbers tripled 😅`,
  Bold:         (topic, audience) => `${topic} is the only thing standing between ${audience} and irrelevance in 2026.`,
  Inspiring:    (topic, audience) => `One year ago, ${audience} had zero traction. Then they discovered ${topic}. Here's the full story.`,
  Friendly:     (topic, audience) => `Hey ${audience} 👋 — quick story about how ${topic} changed everything for me.`,
  Professional: (topic, audience) => `The data is clear: ${audience} leveraging ${topic} see 3x higher engagement. Here's why.`,
  Emotional:    (topic, audience) => `I almost gave up on ${topic}. Until I realized what ${audience} actually needed to hear.`,
  Educational:  (topic, audience) => `Most ${audience} don't know this about ${topic} — and it's costing them reach. 🧵`,
  Controversial:(topic, audience) => `Unpopular opinion: ${topic} is actually holding ${audience} back. And nobody is saying it.`,
};

const PLATFORM_FORMAT_TIPS = {
  Instagram: 'Reel (0:15–0:30) with trending audio. Add 3–5 story slides for retention loop.',
  'Twitter/X': '5–8 tweet thread. First tweet must work as a standalone hook.',
  LinkedIn: 'Document carousel (PDF) with 8–10 slides or long-form text post with line breaks.',
  YouTube: 'Short (under 60s). Hook must land in first 2 seconds. End with strong pattern interrupt.',
  Facebook: 'Native video or image carousel. Community-question angle drives most comments.',
  Threads: 'Single punchy opinion post (under 500 chars). Ask one direct question at the end.',
};

const PLATFORM_TIMES = {
  Instagram: 'Tuesday or Wednesday, 6:30–9:00 PM IST',
  'Twitter/X': 'Monday–Thursday, 9:00–11:00 AM EST',
  LinkedIn: 'Tuesday–Thursday, 8:00–10:00 AM IST',
  YouTube: 'Friday or Saturday, 5:00–8:00 PM local time',
  Facebook: 'Wednesday or Thursday, 1:00–4:00 PM local time',
  Threads: 'Weekdays 12:00–2:00 PM or 8:00–10:00 PM IST',
};

const generateHashtags = (topic, platform) => {
  const base = TRENDS[platform] || [];
  const topicTag = `#${topic.replace(/\s+/g,'').replace(/[^a-zA-Z0-9]/g,'')}`;
  return [topicTag, ...base].slice(0, 8);
};

const scoreContent = (hook, tone, platform) => {
  const hookStrength = tone === 'Bold' || tone === 'Controversial' ? 23 : tone === 'Witty' ? 22 : 20;
  const emotionalTrigger = tone === 'Emotional' || tone === 'Inspiring' ? 23 : tone === 'Witty' ? 21 : 19;
  const trendAlignment = ['Instagram', 'Twitter/X', 'Threads'].includes(platform) ? 22 : 20;
  const ctaClarity = 21;
  const total = hookStrength + emotionalTrigger + trendAlignment + ctaClarity;
  const label = total >= 90 ? 'Exceptional' : total >= 75 ? 'Strong' : total >= 60 ? 'Good' : 'Average';
  return { total, hookStrength, emotionalTrigger, trendAlignment, ctaClarity, label };
};

export const generateViralContent = async (brief) => {
  await new Promise(r => setTimeout(r, 2200));
  const { topic, audience, goals, tone, platforms } = brief;
  const t = topic || 'your product';
  const a = audience || 'creators';

  return {
    session: { topic: t, audience: a, goal: goals, tone, platforms_selected: platforms },
    generated_content: platforms.map(platform => {
      const hook = HOOKS_BY_TONE[tone]?.(t, a) || `Discover how ${t} transforms outcomes for ${a}.`;
      const score = scoreContent(hook, tone, platform);
      return {
        platform,
        hook,
        body: `If you're a ${a} and you're not paying attention to ${t} right now, you're missing one of the biggest opportunities of 2026.\n\nHere's the reality: the top performing creators in your niche are already using these insights to outpace competitors who still rely on gut-feel decisions.\n\nWe've broken down exactly what works, why it works, and how you can implement it in the next 24 hours — without any paid tools.\n\nSave this post. Come back to it. Then drop a 🔥 in the comments so I know you're serious about your growth.`,
        cta: `Comment "${t.split(' ')[0].toUpperCase()}" below and I'll DM you the free strategy guide.`,
        hashtags: generateHashtags(t, platform),
        format_tip: PLATFORM_FORMAT_TIPS[platform] || 'Short-form video recommended.',
        best_post_time: PLATFORM_TIMES[platform] || 'Weekdays 6–9 PM local time',
        virality_score: {
          ...score,
          score_label: `${score.label} — ${score.total >= 80 ? 'above average reach' : 'solid performance'} expected`,
          improvement_tip: `Add a specific number to your hook (e.g. "3x") for a +5 virality boost.`,
        },
      };
    }),
    trending_hashtags: (function() {
      const allPlatforms = platforms.length ? platforms : ['Instagram'];
      const tags = [];
      const seen = new Set();
      allPlatforms.forEach(p => {
        (TRENDS[p] || []).forEach(tag => {
          if (!seen.has(tag)) {
            seen.add(tag);
            tags.push({
              hashtag: tag,
              relevance: `High resonance with ${a} on ${p}`,
              reach_potential: seen.size <= 2 ? 'Viral' : seen.size <= 4 ? 'High' : 'Medium',
              content_angle: `Use ${tag} with a bold opinion about ${t} to ride this wave.`,
            });
          }
        });
      });
      return tags.slice(0, 6);
    })(),
    ai_tip: `Your audience of "${a}" peaks in engagement on ${platforms[0] || 'Instagram'} between 6–9 PM on Tuesday/Wednesday. Pair your ${tone.toLowerCase()} tone with a specific data point or personal failure story in the first sentence — that combo is currently driving 2–3x more saves than generic hooks.`,
  };
};

export const PLATFORM_ICONS = {
  Instagram: '📸',
  'Twitter/X': '𝕏',
  LinkedIn: '💼',
  YouTube: '▶️',
  Facebook: '📘',
  Threads: '🧵',
};

export const mockAnalytics = {
  totalReach: '4.2M',
  engagementRate: '8.7%',
  avgViralityScore: 81,
  contentPieces: 247,
  weeklyData: [
    { day: 'Mon', reach: 420, engagement: 38, virality: 72 },
    { day: 'Tue', reach: 780, engagement: 65, virality: 84 },
    { day: 'Wed', reach: 940, engagement: 72, virality: 88 },
    { day: 'Thu', reach: 610, engagement: 50, virality: 77 },
    { day: 'Fri', reach: 850, engagement: 68, virality: 82 },
    { day: 'Sat', reach: 1100, engagement: 89, virality: 91 },
    { day: 'Sun', reach: 730, engagement: 61, virality: 79 },
  ],
  platformSplit: [
    { name: 'Instagram', value: 38, color: '#e879f9' },
    { name: 'LinkedIn', value: 24, color: '#60a5fa' },
    { name: 'Twitter/X', value: 20, color: '#34d399' },
    { name: 'YouTube', value: 12, color: '#fb923c' },
    { name: 'Others', value: 6, color: '#94a3b8' },
  ],
  topContent: [
    { title: 'AI replacing jobs thread', platform: 'Twitter/X', reach: '280K', score: 92, change: '+14%' },
    { title: '5 mistakes every creator makes', platform: 'Instagram', reach: '210K', score: 88, change: '+9%' },
    { title: 'How I 10x\'d my LinkedIn', platform: 'LinkedIn', reach: '190K', score: 86, change: '+21%' },
    { title: 'The truth about viral content', platform: 'Threads', reach: '150K', score: 83, change: '+5%' },
    { title: 'Morning routine that doubled results', platform: 'YouTube', reach: '130K', score: 80, change: '+12%' },
  ],
};

export const calendarData = [
  { day: 'Mon', date: 'Apr 7', platform: 'LinkedIn', topic: 'AI productivity tips', format: 'Carousel', tone: 'Professional', hook: 'I saved 3 hours/day. Here\'s how.', time: '9:00 AM' },
  { day: 'Tue', date: 'Apr 8', platform: 'Instagram', topic: 'Behind the scenes', format: 'Reel', tone: 'Friendly', hook: 'Nobody shows you this part...', time: '7:00 PM' },
  { day: 'Wed', date: 'Apr 9', platform: 'Twitter/X', topic: 'Controversial take', format: 'Thread', tone: 'Bold', hook: 'Most creators are wasting time.', time: '11:00 AM' },
  { day: 'Thu', date: 'Apr 10', platform: 'YouTube', topic: 'Tutorial walkthrough', format: 'Short', tone: 'Educational', hook: 'Do this in 60 seconds.', time: '6:00 PM' },
  { day: 'Fri', date: 'Apr 11', platform: 'Instagram', topic: 'Motivational story', format: 'Post', tone: 'Inspiring', hook: 'One year ago I had 0 followers.', time: '8:00 PM' },
  { day: 'Sat', date: 'Apr 12', platform: 'Threads', topic: 'Hot take opinion', format: 'Post', tone: 'Controversial', hook: 'Unpopular: Consistency is overrated.', time: '12:00 PM' },
  { day: 'Sun', date: 'Apr 13', platform: 'LinkedIn', topic: 'Week in review', format: 'Text Post', tone: 'Emotional', hook: 'This week nearly broke me.', time: '6:00 PM' },
];
