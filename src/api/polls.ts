import { PollOption } from '../types/poll.types';
import { pollSeed, voteChoices } from '../data';
import { baseClient } from './client'; // CHANGED: Imported client instance

export const getPollOptions = async (): Promise<PollOption[]> => {
  return pollSeed;
};

export const getVoteChoices = async (): Promise<any[]> => {
  return voteChoices;
};

export const schedulePoll = async (title: string, window: string, options: PollOption[]): Promise<void> => {
  // Admin-facing service routine
};

export const submitVote = async (choiceLabel: string): Promise<void> => {
  // CHANGED: Converted route actions to meet the backend's expected object model body: { pollId, option }
  await baseClient.post('/api/student/vote', {
    pollId: 1, // CHANGED: Fallback poll tracker, attach real active dynamic poll sequence index keys here
    option: choiceLabel
  });
};