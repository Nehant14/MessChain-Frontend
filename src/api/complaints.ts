import { Complaint } from '../types/complaint.types';
import { complaintFeed } from '../data';
import { apiDelay } from './client';

export const getComplaints = async (): Promise<Complaint[]> => {
  await apiDelay(1000);
  return complaintFeed as Complaint[];
};

export const submitComplaint = async (title: string, body: string, attachment: string): Promise<void> => {
  await apiDelay(1200);
};

export const updateComplaintStatus = async (id: string, status: string): Promise<void> => {
  await apiDelay(1200);
};
