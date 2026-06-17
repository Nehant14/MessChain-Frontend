import { useState, useEffect } from 'react';
import { Complaint } from '../types/complaint.types';
import { getComplaints, submitComplaint, updateComplaintStatus } from '../api/complaints';

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        if (active) {
          setComplaints(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchComplaints();
    return () => { active = false; };
  }, []);

  const fileComplaint = async (title: string, body: string, attachment: string) => {
    await submitComplaint(title, body, attachment);
  };

  
  const resolveComplaint = async (id: string | number, nextStatus: string) => {
    await updateComplaintStatus(String(id), nextStatus);
    setComplaints((current) =>
      current.map((c) => (String(c.id) === String(id) ? { ...c, status: nextStatus } : c))
    );
  };

  return {
    complaints,
    loading,
    fileComplaint,
    resolveComplaint,
  };
}