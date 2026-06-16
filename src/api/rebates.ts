import { RebateClaim } from '../types/rebate.types';
import { rebateClaims } from '../data';
import { baseClient, apiDelay } from './client'; // CHANGED: Imported apiDelay alongside baseClient

export const getRebates = async (): Promise<RebateClaim[]> => {
  // NOTE: If this screen is shared by both student and admin, 
  // you can return mock data for now so the admin screen doesn't break.
  // KEEP AS IS: Returning local mock data for fallback
  await apiDelay(500);
  return rebateClaims;
};

/**
 * LIVE STUDENT ACTION: Connected to your active student controller backend
 */
export const requestRebate = async (fromDate: number, toDate: number): Promise<void> => {
  await baseClient.post('/api/student/request-rebate', {
    fromDate,
    toDate,
  });
};

/**
 * KEEP AS IS: Admin feature using mock delay since admin backend isn't built yet
 */
export const approveRebate = async (id: string): Promise<void> => {
  await apiDelay(1200); // Original simulated processing delay
};

/**
 * KEEP AS IS: Admin feature using mock delay
 */
export const denyRebate = async (id: string): Promise<void> => {
  await apiDelay(1200); // Original simulated processing delay
};