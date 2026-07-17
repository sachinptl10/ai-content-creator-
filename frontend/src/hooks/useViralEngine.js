import { useState } from 'react';
import client from '../api/client';

export const useViralEngine = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = async (brief) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await client.post('/content/generate', brief);
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate content');
      console.error('Generation failure:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getHistory = async () => {
    try {
      const res = await client.get('/content/history');
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error('History fetch failure:', err);
      return [];
    }
  };

  const getAnalyticsOverview = async () => {
    try {
      const res = await client.get('/analytics/overview');
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      console.error('Analytics fetch failure:', err);
      // Return mock-like structure if backend analytic routes aren't built yet
      return null;
    }
  };

  return { generateContent, getHistory, getAnalyticsOverview, isGenerating, error };
};
