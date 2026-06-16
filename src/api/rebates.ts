import { RebateClaim } from '../types/rebate.types';
import { rebateClaims } from '../data';
import { apiDelay } from './client';

export const getRebates = async (): Promise<RebateClaim[]> => {
  await apiDelay(500);
  return rebateClaims;
};

export const approveRebate = async (id: string): Promise<void> => {
  await apiDelay(1200);
};

export const denyRebate = async (id: string): Promise<void> => {
  await apiDelay(1200);
};
