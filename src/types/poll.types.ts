export interface PollOption {
  label: string;
  votes: number;
}

export interface PollDraft {
  title: string;
  window: string;
  options: PollOption[];
}
