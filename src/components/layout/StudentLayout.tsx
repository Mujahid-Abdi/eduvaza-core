import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { AIChatbotButton } from '@/components/shared';
import { useAuth } from '@/contexts/AuthContext';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Only show chatbot for students
  const isStudent = user?.role === 'student';

  return (
    <DashboardLayout>
      {isStudent && <AIChatbotButton />}
      {children}
    </DashboardLayout>
  );
};
