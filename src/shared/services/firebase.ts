import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import Constants from 'expo-constants';
import type { UserProfile, JournalEntry, NumerologyReport, Conversation, LessonProgress } from '@/shared/types';
import { COLLECTIONS } from '../../../firebase/schema';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

function getFirebaseApp() {
  if (!extra.firebaseApiKey) {
    console.warn('Firebase not configured — running in offline/local mode');
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = getFirebaseApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInAsGuest() {
  return signInAnonymously(auth);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function saveUserProfile(userId: string, profile: Partial<UserProfile>) {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(ref, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function deleteUserAccount(userId: string) {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await deleteDoc(userRef);
}

export async function saveReport(userId: string, report: NumerologyReport) {
  const ref = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.REPORTS, report.id);
  await setDoc(ref, report);
}

export async function getReports(userId: string, max = 20): Promise<NumerologyReport[]> {
  const ref = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.REPORTS);
  const q = query(ref, orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as NumerologyReport);
}

export async function saveJournalEntry(userId: string, entry: JournalEntry) {
  const ref = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.JOURNAL, entry.id);
  await setDoc(ref, entry);
}

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const ref = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.JOURNAL);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as JournalEntry);
}

export async function searchJournal(userId: string, term: string): Promise<JournalEntry[]> {
  const entries = await getJournalEntries(userId);
  const lower = term.toLowerCase();
  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(lower) ||
      e.content.toLowerCase().includes(lower) ||
      e.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

export async function saveConversation(userId: string, conversation: Conversation) {
  const ref = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CONVERSATIONS, conversation.id);
  await setDoc(ref, conversation);
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const ref = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.CONVERSATIONS);
  const q = query(ref, orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Conversation);
}

export async function saveLessonProgress(userId: string, progress: LessonProgress) {
  const ref = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.PROGRESS, progress.lessonId);
  await setDoc(ref, progress);
}

export async function getLessonProgress(userId: string): Promise<LessonProgress[]> {
  const ref = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.PROGRESS);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as LessonProgress);
}

export async function updatePremiumStatus(userId: string, isPremium: boolean) {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(ref, { isPremium, updatedAt: new Date().toISOString() });
}

export async function getLessons(): Promise<import('@/shared/types').Lesson[]> {
  const { getLessons: getLocalLessons } = await import('./api/lessons');
  return getLocalLessons();
}
