import { PollOption } from '../types/poll.types';
import { pollSeed, voteChoices } from '../data';
import { baseClient } from './client';

export const getPollOptions = async (): Promise<PollOption[]> => {
  return pollSeed;
};

export const getVoteChoices = async (): Promise<any[]> => {
  return voteChoices;
};

export const schedulePoll = async (
  title: string,
  window: string,
  options: string[],
): Promise<void> => {
  await baseClient.post('/api/admin/create-poll', {
    question: title,
    window,
    options,
  });
};

export const submitVote = async (choiceLabel: string): Promise<void> => {
  await baseClient.post('/api/student/vote', {
    pollId: 1,
    option: choiceLabel,
  });
};