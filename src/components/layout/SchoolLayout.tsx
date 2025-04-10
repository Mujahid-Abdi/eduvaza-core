import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { AIChatbotButton } from '@/components/shared';
import { useAuth } from '@/contexts/AuthContext';

interface SchoolLayoutProps {
  children: React.ReactNode;
}

export const SchoolLayout: React.FC<SchoolLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Only show chatbot for school admins
  const isSchool = user?.role === 'school';

  return (
    <DashboardLayout>
      {isSchool && <AIChatbotButton />}
      {children}
    </DashboardLayout>
  );
};
