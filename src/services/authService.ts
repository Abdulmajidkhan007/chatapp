// src/services/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppUser } from '../types';

const mapFirebaseUser = (user: User): AppUser => ({
  uid:         user.uid,
  email:       user.email ?? '',
  displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
  photoURL:    user.photoURL,
  createdAt:   Date.now(),
  lastSeen:    Date.now(),
  isOnline:    true,
});

const mapAuthError = (error: AuthError): string => {
  const codes: Record<string, string> = {
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':     'Invalid email or password.',
  };
  return codes[error.code] ?? 'An unexpected error occurred. Please try again.';
};

export const signIn = async (email: string, password: string): Promise<AppUser> => {
  try {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as AppUser;
    }
    return mapFirebaseUser(cred.user);
  } catch (err) {
    throw new Error(mapAuthError(err as AuthError));
  }
};

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
): Promise<AppUser> => {
  try {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const user: AppUser = {
      uid:         cred.user.uid,
      email:       cred.user.email ?? '',
      displayName,
      photoURL:    null,
      createdAt:   Date.now(),
      lastSeen:    Date.now(),
      isOnline:    true,
    };
    await setDoc(doc(db, 'users', user.uid), { ...user, createdAt: serverTimestamp() });
    return user;
  } catch (err) {
    throw new Error(mapAuthError(err as AuthError));
  }
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const onAuthChange = (callback: (user: AppUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        callback(userDoc.data() as AppUser);
      } else {
        callback(mapFirebaseUser(firebaseUser));
      }
    } catch {
      callback(mapFirebaseUser(firebaseUser));
    }
  });
};
