// This mock service simulates the complex AI logic specified in the ViralIQ system prompt.
export const generateViralContent = async (brief) => {
  // Simulate network delay for effect
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { topic, audience, goals, tone, platforms } = brief;

  const simulatedResponse = {
    session: {
      topic: topic || 'Default Topic',
      audience: audience || 'General Audience',
      goal: goals || 'Engagement',
      tone: tone || 'Witty',
      platforms_selected: platforms.length ? platforms : ['Instagram']
    },
    generated_content: platforms.map(platform => {
      let hook = '';
      let formatTip = '';
      if (platform === 'Instagram') {
        hook = `Stop scrolling if you want to master ${topic} 🛑`;
        formatTip = 'Reel with trending audio and B-roll of the product/topic in action.';
      } else if (platform === 'Twitter/X') {
        hook = `Unpopular opinion: ${topic} is changing the game for ${audience}. Here's why 🧵`;
        formatTip = 'Thread format. Leading tweet must have an eye-catching statistic.';
      } else if (platform === 'LinkedIn') {
        hook = `I used to struggle with targeting ${audience}. Then I discovered ${topic}.`;
        formatTip = 'Story-driven post with a carousal PDF.';
      } else {
        hook = `You won't believe how this impacts ${audience}!`;
        formatTip = 'Short-form video with high energy.';
      }

      return {
        platform,
        hook,
        body: `We've designed this explicitly with ${audience} in mind. Achieving '${goals}' has never been easier, especially when you leverage the full potential of this strategy. Keep pushing boundaries, testing new ideas, and staying consistent. Drop a 🔥 if you agree.`,
        cta: `Comment 'SEND' and I'll DM you the exact framework for ${topic}.`,
        hashtags: ['#Growth', '#Strategy', `#${topic.replace(/\s+/g, '')}`, '#Viral', '#Marketing'],
        format_tip: formatTip,
        best_post_time: 'Tuesday 6:30 PM EST',
        virality_score: {
          total: 88,
          hook_strength: 22,
          emotional_trigger: 20,
          trend_alignment: 24,
          cta_clarity: 22,
          score_label: 'Strong — above average reach expected',
          improvement_tip: `Use more emotive language in the second sentence for a stronger connection with ${audience}.`
        }
      };
    }),
    trending_hashtags: [
      {
        hashtag: `#${topic.replace(/\s+/g, '')}Hacks`,
        relevance: `Highly relevant for ${audience}`,
        reach_potential: 'Viral',
        content_angle: `Myth-busting common beliefs about ${topic}`
      },
      {
        hashtag: `#Growth2026`,
        relevance: 'Broad contextual trend',
        reach_potential: 'Medium',
        content_angle: 'Sharing a controversial opinion'
      }
    ],
    ai_tip: `Since you're targeting ${audience} with a ${tone} tone, focus heavily on relatable pain points in the first 3 seconds of your videos before introducing ${topic}.`
  };

  return simulatedResponse;
};
