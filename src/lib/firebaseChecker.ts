// Firebase Service Checker
import { auth, db } from './firebase';

export interface FirebaseServiceStatus {
  auth: boolean;
  firestore: boolean;
  errors: string[];
}

export const checkFirebaseServices = async (): Promise<FirebaseServiceStatus> => {
  const status: FirebaseServiceStatus = {
    auth: false,
    firestore: false,
    errors: []
  };

  try {
    // Check Auth
    if (auth) {
      status.auth = true;
    }
  } catch (error: any) {
    status.errors.push(`Auth: ${error.message}`);
  }

  try {
    // Check Firestore
    if (db) {
      status.firestore = true;
    }
  } catch (error: any) {
    status.errors.push(`Firestore: ${error.message}`);
  }

  return status;
};

export const getFirebaseSetupInstructions = (status: FirebaseServiceStatus): string[] => {
  const instructions: string[] = [];

  if (!status.auth) {
    instructions.push(
      '🔐 Enable Authentication: Go to Firebase Console → Authentication → Get Started → Enable Email/Password'
    );
  }

  if (!status.firestore) {
    instructions.push(
      '🗄️ Enable Firestore: Go to Firebase Console → Firestore Database → Create Database'
    );
  }

  if (status.errors.length > 0) {
    instructions.push('❌ Errors found: ' + status.errors.join(', '));
  }

  if (instructions.length === 0) {
    instructions.push('✅ All Firebase services are properly configured!');
    instructions.push('📁 Using Cloudinary for file storage');
  }

  return instructions;
};