import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { AppUser } from '../types';

export const searchUsers = async (searchTerm: string, currentUid: string): Promise<AppUser[]> => {
  if (!searchTerm.trim() || searchTerm.trim().length < 2) return [];
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('displayName'),
      limit(20),
    );
    const snap = await getDocs(q);
    const term = searchTerm.toLowerCase();
    return snap.docs
      .map((d) => d.data() as AppUser)
      .filter(
        (u) =>
          u.uid !== currentUid &&
          (u.displayName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)),
      );
  } catch {
    return [];
  }
};

export const getUsersByIds = async (uids: string[]): Promise<AppUser[]> => {
  if (uids.length === 0) return [];
  try {
    const q = query(collection(db, 'users'), where('uid', 'in', uids.slice(0, 10)));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as AppUser);
  } catch {
    return [];
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<Pick<AppUser, 'displayName' | 'photoURL'>>,
): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, updates);
  }
};
