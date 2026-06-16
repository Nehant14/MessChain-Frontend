import { StaffMember } from '../types/staff.types';
import { apiDelay } from './client';

export const createStaffMember = async (member: StaffMember): Promise<void> => {
  await apiDelay(1200);
};
