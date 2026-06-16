export interface Complaint {
  id: string;
  urgency: 'High' | 'Medium' | 'Low' | string;
  status: string;
  title: string;
  body: string;
  ipfs: string;
}
