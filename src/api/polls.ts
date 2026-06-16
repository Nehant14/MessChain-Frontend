import { PollOption } from '../types/poll.types';
import { pollSeed, voteChoices } from '../data';
import { apiDelay } from './client';

export const getPollOptions = async (): Promise<PollOption[]> => {
  await apiDelay(500);
  return pollSeed;
};

export const getVoteChoices = async (): Promise<any[]> => {
  await apiDelay(500);
  return voteChoices;
};

export const schedulePoll = async (title: string, window: string, options: PollOption[]): Promise<void> => {
  await apiDelay(1200);
};

export const submitVote = async (choiceLabel: string): Promise<void> => {
  await apiDelay(500);
};
