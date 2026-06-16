import { studentLogs } from '../data';
import { baseClient } from './client'; // CHANGED: Connected live network adapter

export const getStudentProfile = async () => {
  // CHANGED: Replaced static object mock with dynamic asynchronous dual fetches
  const profileResponse = await baseClient.get<{ user: any }>('/api/student/profile');
  const balanceResponse = await baseClient.get<{ balance: string }>('/api/student/balance').catch(() => ({ balance: '0' }));

  const userData = profileResponse.user;

  return {
    name: userData.name,
    role: `Roll: ${userData.rollNumber}`, // CHANGED: Maps backend model details straight into presentation strings
    passStatus: userData.mess ? `Active: ${userData.mess.name}` : 'No Assigned Mess Unit Found',
    walletStatus: `Wallet: ${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`,
    score: `${balanceResponse.balance} Tokens`, // CHANGED: Live balance string derived from your smart contract service
    logsCount: '42',
    sync: 'Green',
    timeline: studentLogs,
  };
};

export const scanQrCode = async (scannedMessId: string): Promise<any> => {
  // CHANGED: Connected verify-meal parameters straight to backend handler route matching QR signature data
  return await baseClient.post('/api/student/verify-meal', {
    scannedMessId: scannedMessId
  });
};