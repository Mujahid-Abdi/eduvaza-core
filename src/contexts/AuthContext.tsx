import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { User, UserRole, AuthContextType, RegisterData } from '@/types';
import { authService } from '@/services/auth';
import { LoadingScreen } from '@/components/ui/loading-screen';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setInitializationError(null);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        setInitializationError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      if (isLoading) {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [isLoading]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.loginWithEmail(email, password);
      setUser(loggedInUser);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhone = useCallback(async (phone: string, code: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.loginWithPhone(phone, code);
      setUser(loggedInUser);
    } catch (error: any) {
      console.error('Phone login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendPhoneCode = useCallback(async (phone: string) => {
    try {
      return await authService.sendPhoneCode(phone);
    } catch (error: any) {
      console.error('Send phone code error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(data);
      setUser(newUser);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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

  // Show loading screen during initial Firebase setup
  if (isLoading && !user) {
    return (
      <LoadingScreen 
        message="Initializing AfEdulight"
        submessage={initializationError ? 
          "Having trouble connecting to Firebase. Please check your setup." : 
          "Setting up your learning environment..."
        }
      />
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithPhone,
        sendPhoneCode,
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
