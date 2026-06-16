import { FeedbackBar } from '../types/feedback.types';
import { feedbackBars } from '../data';
import { apiDelay } from './client';

export const getFeedbackReport = async (): Promise<FeedbackBar[]> => {
  await apiDelay(500);
  return feedbackBars;
};

export const submitFeedback = async (rating: number, mealWindow: string): Promise<void> => {
  await apiDelay(1200);
};
