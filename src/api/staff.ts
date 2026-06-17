import { baseClient } from './client'; // CHANGED: Swapped apiDelay mock with baseClient instance

export const createStaffMember = async (member: any): Promise<void> => {
  
  await baseClient.post('/api/admin/create-staff', {
    email: member.email,
    password: member.password,
    name: member.name,
    messId: member.messId
  });
};