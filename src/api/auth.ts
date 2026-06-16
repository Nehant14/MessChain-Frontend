import { AuthSession } from '../types/auth.types';
import { resolveRoleFromEmail } from '../utils/roleResolver';
import { apiDelay } from './client';

export const loginUser = async (email: string): Promise<AuthSession> => {
  await apiDelay(800); // simulate API call
  const role = resolveRoleFromEmail(email);
  return {
    email,
    role,
    token: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
  };
};
