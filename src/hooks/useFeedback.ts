import { useState, useEffect } from 'react';
import { FeedbackBar } from '../types/feedback.types';
import { getFeedbackReport, submitFeedback } from '../api/feedback';

export function useFeedback() {
  const [feedbackBars, setFeedbackBars] = useState<FeedbackBar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchFeedback = async () => {
      try {
        const data = await getFeedbackReport();
        if (active) {
          setFeedbackBars(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchFeedback();
    return () => { active = false; };
  }, []);

  const sendFeedbackReport = async (rating: number, mealWindow: string) => {
    await submitFeedback(rating, mealWindow);
  };

  return {
    feedbackBars,
    loading,
    sendFeedbackReport,
  };
}
