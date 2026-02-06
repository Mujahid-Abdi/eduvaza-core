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

  // Check if user needs approval (teacher or school with pending status)
  if (user && (user.role === 'teacher' || user.role === 'school')) {
    if (user.approvalStatus === 'pending') {
      // Allow access to pending approval page
      if (location.pathname !== '/auth/pending-approval') {
        return <Navigate to="/auth/pending-approval" replace />;
      }
    } else if (user.approvalStatus === 'rejected') {
      // Redirect to a rejection page or login with message
      return <Navigate to="/auth/login" state={{ rejected: true }} replace />;
    }
  }

  // Check if user has required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths: Record<UserRole, string> = {
      super_admin: '/admin/dashboard',
      school: '/school/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
    };
    
    const redirectPath = dashboardPaths[user.role];
    
    // Prevent redirect loop - don't redirect if already on a page for this role
    const roleBasePath = redirectPath.split('/dashboard')[0];
    if (!location.pathname.startsWith(roleBasePath)) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};
