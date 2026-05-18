// src/services/chatService.ts
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Unsubscribe,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { Chat } from '../types';

export const subscribeToChats = (
  userId: string,
  callback: (chats: Chat[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const chats: Chat[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Chat));
      callback(chats);
    },
    onError,
  );
};

export const createDirectChat = async (
  currentUser: { uid: string; displayName: string; photoURL: string | null },
  otherUser:   { uid: string; displayName: string; photoURL: string | null },
): Promise<string> => {
  // Check if direct chat already exists
  const q = query(
    collection(db, 'chats'),
    where('type', '==', 'direct'),
    where('participants', 'array-contains', currentUser.uid),
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) => {
    const data = d.data() as Chat;
    return data.participants.includes(otherUser.uid);
  });
  if (existing) return existing.id;

  const chatData: Omit<Chat, 'id'> = {
    name:    otherUser.displayName,
    type:    'direct',
    photoURL: otherUser.photoURL,
    participants: [currentUser.uid, otherUser.uid],
    participantDetails: {
      [currentUser.uid]: {
        uid:         currentUser.uid,
        displayName: currentUser.displayName,
        photoURL:    currentUser.photoURL,
        isOnline:    true,
        lastSeen:    Date.now(),
      },
      [otherUser.uid]: {
        uid:         otherUser.uid,
        displayName: otherUser.displayName,
        photoURL:    otherUser.photoURL,
        isOnline:    false,
        lastSeen:    Date.now(),
      },
    },
    lastMessage:  null,
    unreadCount:  0,
    createdAt:    Date.now(),
    updatedAt:    Date.now(),
    typingUsers:  {},
  };

  const ref = await addDoc(collection(db, 'chats'), {
    ...chatData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const setTypingStatus = async (
  chatId: string,
  userId: string,
  isTyping: boolean,
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'chats', chatId), {
      [`typingUsers.${userId}`]: isTyping,
    });
  } catch {
    // silently ignore typing errors
  }
};
