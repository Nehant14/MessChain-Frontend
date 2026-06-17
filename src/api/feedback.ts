import { FeedbackBar } from '../types/feedback.types';
import { feedbackBars } from '../data';
import { baseClient } from './client'; // CHANGED: Tied into baseClient layer

export const getFeedbackReport = async (): Promise<FeedbackBar[]> => {
  return feedbackBars;
};

export const submitFeedback = async (rating: number, mealWindow: string): Promise<void> => {
  
  await baseClient.post('/api/student/file-feedback', {
    messId: "cl0123456789012username", 
    text: `Meal Service Window: ${mealWindow} | Operational Rating Score: ${rating}/5 Stars`
  });
};