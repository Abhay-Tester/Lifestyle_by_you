import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with long-polling to prevent proxy/iframe backend connection drops
const dbId = firebaseConfig.firestoreDatabaseId || '(default)';

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    dbId
  );
} catch {
  firestoreInstance = getFirestore(app, dbId);
}

export const db = firestoreInstance;

// Initialize Authentication
export const auth = getAuth(app);

// Test Firestore backend connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore running in offline cache mode.");
    }
  }
}
testConnection();

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

