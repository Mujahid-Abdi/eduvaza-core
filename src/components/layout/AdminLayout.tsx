import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { AIChatbotButton } from '@/components/shared';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Only show chatbot for admins
  const isAdmin = user?.role === 'admin';

  return (
    <DashboardLayout>
      {isAdmin && <AIChatbotButton />}
      {children}
    </DashboardLayout>
  );
};
