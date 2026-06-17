import { Complaint } from '../types/complaint.types';
import { baseClient } from './client';

export const getComplaints = async (): Promise<Complaint[]> => {
  return baseClient.get<Complaint[]>('/api/admin/complaints');
};

export const submitComplaint = async (title: string, body: string, attachment: string): Promise<void> => {
  await baseClient.post('/api/student/file-complaint', {
    messId: 'cl0123456789012username',
    text: `[Subject: ${title}] ${body} (Attachment reference: ${attachment})`,
  });
};

export const updateComplaintStatus = async (id: string, status: string): Promise<void> => {
  await baseClient.post(`/api/admin/complaints/${id}/status`, { status });
};