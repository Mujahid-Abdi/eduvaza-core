// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCydwG5JY1dajuUvRgvnjq2kLpxwLj8mk0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduvaza-cfbec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduvaza-cfbec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduvaza-cfbec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "48704181755",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:48704181755:web:2eafa407710e3e3fcea75e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XYNHNBQZ4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;