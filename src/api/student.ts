import { studentLogs } from '../data';
import { apiDelay } from './client';

export const getStudentProfile = async () => {
  await apiDelay(500);
  return {
    name: 'Aarav Mehta',
    role: 'Resident ID',
    passStatus: 'Lunch pass active',
    walletStatus: 'Wallet linked',
    score: '98.3',
    logsCount: '42',
    sync: 'Green',
    timeline: studentLogs,
  };
};

export const scanQrCode = async (data: string): Promise<void> => {
  await apiDelay(800);
};
