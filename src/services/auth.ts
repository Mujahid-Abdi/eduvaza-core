// Firebase Auth Service
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole, RegisterData } from '@/types';
import { mockUsers } from './mockData';

// Development mode flag - set to true to use mock authentication
const DEV_MODE = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || false;

// Store phone confirmation result
let confirmationResult: ConfirmationResult | null = null;

// Mock auth helpers for development
const mockAuthHelpers = {
  findUserByEmail: (email: string): User | undefined => {
    return mockUsers.find(u => u.email === email);
  },
  
  validatePassword: (password: string): boolean => {
    // In dev mode, accept any password that's at least 6 characters
    return password.length >= 6;
  }
};

export const authService = {
  async loginWithEmail(email: string, password: string): Promise<User> {
    // Development mode - use mock authentication
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using mock authentication');
      const user = mockAuthHelpers.findUserByEmail(email);
      
      if (!user) {
        throw new Error('No account found with this email address.');
      }
      
      if (!mockAuthHelpers.validatePassword(password)) {
        throw new Error('Password must be at least 6 characters.');
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('mockUser', JSON.stringify(user));
      return user;
    }

    // Production mode - use Firebase
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = {
          id: firebaseUser.uid,
          ...userDoc.data()
        } as User;
        
        console.log('🔥 Firebase User Data:', userData);
        console.log('🔥 User Role:', userData.role);
        
        return userData;
      } else {
        // Create basic user profile if doesn't exist
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || email.split('@')[0],
          role: 'student',
          createdAt: new Date(),
          isActive: true,
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.message.includes('Missing or insufficient permissions')) {
        throw new Error('Database permissions not configured. Please contact support.');
      }
      
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  async loginWithPhone(phone: string, code: string): Promise<User> {
    try {
      if (!confirmationResult) {
        throw new Error('Please request a verification code first');
      }
      
      const userCredential = await confirmationResult.confirm(code);
      const firebaseUser = userCredential.user;
      
      // Get or create user data
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return {
          id: firebaseUser.uid,
          ...userDoc.data()
        } as User;
      } else {
        const userData: User = {
          id: firebaseUser.uid,
          email: '',
          phone: firebaseUser.phoneNumber || phone,
          name: 'Phone User',
          role: 'student',
          createdAt: new Date(),
          isActive: true,
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Phone verification failed');
    }
  },

  async sendPhoneCode(phone: string): Promise<boolean> {
    try {
      // Initialize reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
      
      confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      return true;
    } catch (error: any) {
      console.error('SMS sending failed:', error);
      throw new Error(error.message || 'Failed to send verification code');
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: data.name
      });
      
      // Create user document in Firestore (only include schoolId if it exists)
      const userData: any = {
        id: firebaseUser.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: new Date(),
        isActive: true,
      };

      // Only add optional fields if they exist
      if (data.phone) {
        userData.phone = data.phone;
      }
      
      if (data.schoolId) {
        userData.schoolId = data.schoolId;
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData as User;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please contact support.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.message.includes('Missing or insufficient permissions')) {
        throw new Error('Database permissions not configured. Please contact support.');
      }
      
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Logging out (clearing mock user)');
      localStorage.removeItem('mockUser');
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (DEV_MODE) {
      const mockUser = localStorage.getItem('mockUser');
      return mockUser ? JSON.parse(mockUser) : null;
    }
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        unsubscribe();
        
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              resolve({
                id: firebaseUser.uid,
                ...userDoc.data()
              } as User);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (DEV_MODE) {
      // In dev mode, check localStorage periodically
      const checkAuth = () => {
        const mockUser = localStorage.getItem('mockUser');
        callback(mockUser ? JSON.parse(mockUser) : null);
      };
      
      // Initial check
      checkAuth();
      
      // Listen for storage changes
      window.addEventListener('storage', checkAuth);
      
      // Return cleanup function
      return () => {
        window.removeEventListener('storage', checkAuth);
      };
    }
    
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback({
              id: firebaseUser.uid,
              ...userDoc.data()
            } as User);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};
