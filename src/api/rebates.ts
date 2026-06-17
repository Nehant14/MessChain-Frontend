import { RebateClaim } from '../types/rebate.types';
import { rebateClaims } from '../data';
import { baseClient, apiDelay } from './client';

export const getRebates = async (): Promise<RebateClaim[]> => {
  await apiDelay(500);
  return rebateClaims;
};

export const requestRebate = async (fromDate: number, toDate: number): Promise<void> => {
  await baseClient.post('/api/student/request-rebate', {
    fromDate,
    toDate,
  });
};

export const approveRebate = async (id: string): Promise<void> => {
  await baseClient.post(`/api/admin/rebates/${parseInt(id, 10)}/approve`);
};

export const denyRebate = async (id: string): Promise<void> => {
  await baseClient.post(`/api/admin/rebates/${parseInt(id, 10)}/reject`);
};