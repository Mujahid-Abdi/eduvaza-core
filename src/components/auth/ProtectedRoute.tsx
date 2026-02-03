import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Debug logging
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - User Role:', user?.role);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);
  console.log('ProtectedRoute - Role Check:', allowedRoles && user && !allowedRoles.includes(user.role));

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths: Record<UserRole, string> = {
      super_admin: '/admin',
      school: '/school',
      teacher: '/teacher',
      student: '/student',
    };
    
    console.log('ProtectedRoute - Redirecting to:', dashboardPaths[user.role]);
    return <Navigate to={dashboardPaths[user.role]} replace />;
  }

  return <>{children}</>;
};
