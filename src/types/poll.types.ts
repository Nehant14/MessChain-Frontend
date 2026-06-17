export interface PollOption {
  label: string;
  votes: number;
  tone?: 'emerald' | 'indigo' | 'violet';
}

export interface PollDraft {
  title: string;
  window: string;
  options: PollOption[];
}
