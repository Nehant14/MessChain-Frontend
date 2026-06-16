import { useState, useEffect } from 'react';
import { PollOption } from '../types/poll.types';
import { getPollOptions, getVoteChoices, schedulePoll, submitVote } from '../api/polls';

export function usePolls() {
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [voteChoices, setVoteChoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchPollsData = async () => {
      try {
        const [options, choices] = await Promise.all([getPollOptions(), getVoteChoices()]);
        if (active) {
          setPollOptions(options);
          setVoteChoices(choices);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchPollsData();
    return () => { active = false; };
  }, []);

  const addOption = () => {
    setPollOptions((current) => [...current, { label: `Option ${current.length + 1}`, votes: 0 }]);
  };

  const createNewPoll = async (title: string, window: string) => {
    await schedulePoll(title, window, pollOptions);
  };

  const castVote = async (choiceLabel: string) => {
    await submitVote(choiceLabel);
  };

  return {
    pollOptions,
    setPollOptions,
    voteChoices,
    addOption,
    createNewPoll,
    castVote,
    loading,
  };
}
