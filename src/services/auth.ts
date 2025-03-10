// Mock Auth Service - simulates Firebase Auth
import type { User, UserRole, RegisterData } from '@/types';
import { mockUsers } from './mockData';

export const authService = {
  async loginWithEmail(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      return user;
    }
    
    // For demo, create a new user
    return {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'student',
      createdAt: new Date(),
      isActive: true,
    };
  },

  async loginWithPhone(phone: string, code: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: `phone-${Date.now()}`,
      email: '',
      phone,
      name: 'Phone User',
      role: 'student',
      createdAt: new Date(),
      isActive: true,
    };
  },

  async sendPhoneCode(phone: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  },

  async register(data: RegisterData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      schoolId: data.schoolId,
      createdAt: new Date(),
      isActive: true,
    };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async getCurrentUser(): Promise<User | null> {
    // Check localStorage for persisted session
    const stored = localStorage.getItem('eduvaza_user');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },
};
