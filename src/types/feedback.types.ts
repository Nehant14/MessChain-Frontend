export interface FeedbackBar {
  label: string;
  value: number;
  color: string;
}

export interface FeedbackSubmission {
  rating: number;
  mealWindow: 'Breakfast' | 'Lunch' | 'Dinner' | string;
}
