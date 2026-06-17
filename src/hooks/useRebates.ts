import { useState, useEffect, useContext } from 'react';
import { RebateClaim } from '../types/rebate.types';
import { getRebates, denyRebate } from '../api/rebates';
import { countdownToText } from '../utils/countdown';
import { NetworkContext } from '../context/NetworkContext';

export function useRebates() {
  const [rebates, setRebates] = useState<RebateClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(17418);

  const networkContext = useContext(NetworkContext);
  if (!networkContext) {
    throw new Error('useRebates must be used within a NetworkProvider');
  }
  const { handleApprove, launchProcessing } = networkContext;

  useEffect(() => {
    let active = true;
    const fetchRebates = async () => {
      try {
        const data = await getRebates();
        if (active) {
          setRebates(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchRebates();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((current) => (current > 0 ? current - 1 : 17418)), 1000);
    return () => clearInterval(timer);
  }, []);

  
  const triggerApprove = async (id: string | number) => {
    handleApprove(String(id));
  };

  const triggerDeny = async (id: string | number) => {
    launchProcessing(`deny-${id}`, async () => {
      await denyRebate(String(id));
      
      setRebates((current) =>
        current.map((r) => (String(r.id) === String(id) ? { ...r, status: 'Rejected' } : r))
      );
    });
  };

  return {
    rebates,
    loading,
    countdown,
    countdownText: countdownToText(countdown),
    triggerApprove,
    triggerDeny,
  };
}