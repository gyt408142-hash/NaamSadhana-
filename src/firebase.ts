import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User
} from 'firebase/auth';
import { 
  initializeFirestore, 
  enableIndexedDbPersistence,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Use environment variables if specified, otherwise fallback to local configurations safely
const metaEnv = (import.meta as any).env || {};

const getEnvValue = (key: string, fallback: string) => {
  const val = metaEnv[key];
  if (typeof val === 'string' && val.trim() !== '') {
    const trimmed = val.trim();
    // Filter out placeholder templates, null/undefined strings, or unconfigured variables
    if (
      trimmed !== '' &&
      trimmed !== 'undefined' &&
      trimmed !== 'null' &&
      !trimmed.includes('YOUR_') &&
      !trimmed.includes('MY_')
    ) {
      // If it's the apiKey, it must start with "AIzaSy" to be valid
      if (key === 'VITE_FIREBASE_API_KEY' && !trimmed.startsWith('AIzaSy')) {
        return fallback;
      }
      return trimmed;
    }
  }
  return fallback;
};

const finalConfig = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY', firebaseConfig.apiKey),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId),
  appId: getEnvValue('VITE_FIREBASE_APP_ID', firebaseConfig.appId)
};

// Initialize Firebase App
const app = initializeApp(finalConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore using the configured database ID or fallback to (default)
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';
export const db = initializeFirestore(app, {}, databaseId);

// Enable Firestore Offline Persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed-precondition: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence unimplemented in this browser');
    }
  });
} catch (e) {
  console.error('Error enabling Firestore persistence:', e);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  writeBatch
};
export type { User };
