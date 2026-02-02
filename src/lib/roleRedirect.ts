// Role-based redirect helper
import type { UserRole } from '@/types';

export const getRoleBasedRoute = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'school':
      return '/school';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    default:
      return '/';
  }
};

export const redirectToRoleDashboard = (role: UserRole, navigate: (path: string) => void) => {
  const route = getRoleBasedRoute(role);
  navigate(route);
};