import { useState, useEffect } from 'react';
import { getStudentProfile, scanQrCode } from '../api/student';

export function useStudent() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchStudentProfile = async () => {
      try {
        const data = await getStudentProfile();
        if (active) {
          setProfile(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    };
    fetchStudentProfile();
    return () => { active = false; };
  }, []);

  const registerQrScan = async (data: string) => {
    await scanQrCode(data);
  };

  return {
    profile,
    loading,
    registerQrScan,
  };
}
