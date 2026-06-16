import { Role } from '../theme';

export type AuthSession = {
  email: string;
  role: Role;
  token: string;
};
