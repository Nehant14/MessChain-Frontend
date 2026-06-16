import { apiDelay } from './client';
import { copyToClipboard } from '../components';

export const walletAddress = '0x71C2b8A9d4F3C7A1e9B8d2C5f0A7b3C9dE3A9f';

export const copyWalletToClipboard = async (): Promise<void> => {
  await copyToClipboard(walletAddress);
};

export const anchorToBlockchain = async (data: any): Promise<string> => {
  await apiDelay(1000);
  return '0x' + Math.random().toString(16).slice(2, 10) + '...';
};
