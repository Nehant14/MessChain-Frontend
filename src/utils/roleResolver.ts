import { Role } from '../theme';

export const resolveRoleFromEmail = (email: string): Role => {
  const normalized = email.toLowerCase();
  if (normalized.includes('admin') || normalized.includes('principal') || normalized.includes('manager')) {
    return 'admin';
  }
  if (normalized.includes('staff') || normalized.includes('faculty') || normalized.includes('teacher')) {
    return 'staff';
  }
  return 'student';
};
