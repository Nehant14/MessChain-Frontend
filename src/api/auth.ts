import { AuthSession } from '../types/auth.types';
import { baseClient } from './client';

export const loginUser = async (email: string, password: string): Promise<any> => {
  return baseClient.post('/api/auth/login', { email, password });
};

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  rollNumber: string;
  messId: string;
}): Promise<any> => {
  return baseClient.post('/api/auth/register', data);
};