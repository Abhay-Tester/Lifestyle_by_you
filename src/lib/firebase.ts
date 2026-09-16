import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with explicit databaseId if specified in config
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

const USER_CLIENT_ID_KEY = 'lifeos_firestore_client_uid';

/**
 * Get the currently authenticated Firebase user's UID.
 * If user is authenticated, returns user.uid (ensuring strict per-user isolation).
 * If for any reason no auth user exists yet, returns a device-scoped client ID as fallback.
 */
export function getCurrentUserId(): string {
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }
  try {
    let uid = localStorage.getItem(USER_CLIENT_ID_KEY);
    if (!uid) {
      uid = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(USER_CLIENT_ID_KEY, uid);
    }
    return uid;
  } catch {
    return 'anonymous_user';
  }
}
