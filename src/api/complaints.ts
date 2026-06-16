import { Complaint } from '../types/complaint.types';
import { complaintFeed } from '../data';
import { baseClient } from './client'; // CHANGED: Linked baseClient reference

export const getComplaints = async (): Promise<Complaint[]> => {
  return complaintFeed as Complaint[];
};

export const submitComplaint = async (title: string, body: string, attachment: string): Promise<void> => {
  // CHANGED: Replaced artificial delay loop with an active payload request
  // Backend requires { messId, text }. Consolidating UI fields into the text block.
  await baseClient.post('/api/student/file-complaint', {
    messId: "cl0123456789012username", // CHANGED: Fallback ID; plug in dynamic profile.messId here
    text: `[Subject: ${title}] ${body} (Attachment reference: ${attachment})`
  });
};

export const updateComplaintStatus = async (id: string, status: string): Promise<void> => {
  // Web2 administrative functions go here
};