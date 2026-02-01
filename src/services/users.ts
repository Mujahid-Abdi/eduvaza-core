// Mock Users Service
import type { User, Teacher, Student } from '@/types';
import { mockUsers } from './mockData';

export const usersService = {
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers;
  },

  async getUserById(id: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers.find(u => u.id === id);
  },

  async getTeachersBySchool(schoolId: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.filter(u => u.role === 'teacher' && u.schoolId === schoolId);
  },

  async getStudentsBySchool(schoolId: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.filter(u => u.role === 'student' && u.schoolId === schoolId);
  },

  async createTeacher(data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTeacher: User = {
      id: `teacher-${Date.now()}`,
      email: data.email || '',
      name: data.name || '',
      role: 'teacher',
      schoolId: data.schoolId,
      createdAt: new Date(),
      isActive: true,
    };
    return newTeacher;
  },

  async createStudent(data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStudent: User = {
      id: `student-${Date.now()}`,
      email: data.email || '',
      name: data.name || '',
      role: 'student',
      schoolId: data.schoolId,
      createdAt: new Date(),
      isActive: true,
    };
    return newStudent;
  },
};
