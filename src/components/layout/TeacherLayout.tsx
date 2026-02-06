import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { AIChatbotButton } from '@/components/shared';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Only show chatbot for teachers
  const isTeacher = user?.role === 'teacher';

  return (
    <DashboardLayout>
      {isTeacher && <AIChatbotButton />}
      {children}
    </DashboardLayout>
  );
};
