import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleBasedRoute } from '@/lib/roleRedirect';
import { LoadingScreen } from '@/components/ui/loading-screen';

const LandingRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user?.role) {
        // Redirect all users to home page instead of role-based dashboard
        navigate('/home', { replace: true });
      } else {
        // Redirect to home page for unauthenticated users
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  return <LoadingScreen message="Loading AfEdulight..." />;
};

export default LandingRedirect;
