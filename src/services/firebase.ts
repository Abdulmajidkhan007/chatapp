import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

const requiredVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    '[Firebase] Missing environment variables:',
    missing.join(', '),
    '\nPlease set them in Netlify → Site settings → Environment variables, then redeploy.',
  );
}

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL:       process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth      = getAuth(app);
export const db: Firestore   = getFirestore(app);

// RTDB is optional — only initialize if databaseURL is provided
let _rtdb: Database | null = null;
try {
  if (process.env.REACT_APP_FIREBASE_DATABASE_URL) {
    _rtdb = getDatabase(app);
  }
} catch (e) {
  console.warn('[Firebase] Realtime Database not available:', e);
}
export const rtdb = _rtdb;

export default app;
