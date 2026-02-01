import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, UserRole, AuthContextType, RegisterData } from '@/types';
import { mockUsers, mockSchools } from '@/services/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      // Create mock user for demo
      const demoUser: User = {
        id: 'demo-user',
        email,
        name: email.split('@')[0],
        role: 'student',
        createdAt: new Date(),
        isActive: true,
      };
      setUser(demoUser);
    }
    setIsLoading(false);
  }, []);

  const loginWithPhone = useCallback(async (phone: string, _code: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoUser: User = {
      id: 'phone-user',
      email: '',
      phone,
      name: 'Phone User',
      role: 'student',
      createdAt: new Date(),
      isActive: true,
    };
    setUser(demoUser);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      schoolId: data.schoolId,
      createdAt: new Date(),
      isActive: true,
    };
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const selectRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }, [user]);

  const selectSchool = useCallback((schoolId: string) => {
    if (user) {
      setUser({ ...user, schoolId });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithPhone,
        register,
        logout,
        selectRole,
        selectSchool,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
