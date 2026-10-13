import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  getIdToken,
  type Auth,
  type User,
} from "firebase/auth";

// Official CreaXa Firebase web configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBjfKTxCM8rts9srwXSvWluomgIRUPrhRs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "creaxa-6e7bc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "creaxa-6e7bc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "creaxa-6e7bc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "641625441345",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:641625441345:web:8f922b61d009c6df25f2c0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F82JG95L1J"
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    if (getApps().length > 0) return getApp();
    return initializeApp(firebaseConfig);
  }
  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  getIdToken,
  type User
};
