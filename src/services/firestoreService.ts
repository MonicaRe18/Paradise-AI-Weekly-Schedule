import { db, doc, collection, onSnapshot, setDoc, deleteDoc } from '../lib/firebase';
import { ScheduleData, ArchivedWeek } from '../types';
import { INITIAL_SCHEDULE_DATA } from '../data/initialData';

const SCHEDULE_DOC_PATH = ['schedules', 'main_schedule'] as const;
const PASSWORDS_DOC_PATH = ['app_config', 'passwords'] as const;

export const DEFAULT_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  m1: 'm123',
  m2: 'm123',
  m3: 'm123',
  m4: 'm123',
  m5: 'm123',
  m6: 'm123',
  m7: 'm123',
};

// Real-time subscription to Schedule
export function subscribeToSchedule(onData: (data: ScheduleData) => void): () => void {
  const scheduleDocRef = doc(db, SCHEDULE_DOC_PATH[0], SCHEDULE_DOC_PATH[1]);

  const unsubscribe = onSnapshot(
    scheduleDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ScheduleData;
        onData(data);
      } else {
        // Seed initial data if doc does not exist
        try {
          await setDoc(scheduleDocRef, INITIAL_SCHEDULE_DATA);
          onData(INITIAL_SCHEDULE_DATA);
        } catch (e) {
          console.error('Error seeding initial schedule to Firestore:', e);
          onData(INITIAL_SCHEDULE_DATA);
        }
      }
    },
    (error) => {
      console.error('Firestore schedule snapshot error:', error);
    }
  );

  return unsubscribe;
}

export async function saveScheduleToFirestore(schedule: ScheduleData): Promise<boolean> {
  try {
    const scheduleDocRef = doc(db, SCHEDULE_DOC_PATH[0], SCHEDULE_DOC_PATH[1]);
    await setDoc(scheduleDocRef, schedule);
    return true;
  } catch (e) {
    console.error('Error saving schedule to Firestore:', e);
    return false;
  }
}

// Real-time subscription to Passwords
export function subscribeToPasswords(onData: (passwords: Record<string, string>) => void): () => void {
  const passDocRef = doc(db, PASSWORDS_DOC_PATH[0], PASSWORDS_DOC_PATH[1]);

  const unsubscribe = onSnapshot(
    passDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Record<string, string>;
        onData(data);
      } else {
        try {
          await setDoc(passDocRef, DEFAULT_PASSWORDS);
          onData(DEFAULT_PASSWORDS);
        } catch (e) {
          console.error('Error seeding passwords to Firestore:', e);
          onData(DEFAULT_PASSWORDS);
        }
      }
    },
    (error) => {
      console.error('Firestore passwords snapshot error:', error);
    }
  );

  return unsubscribe;
}

export async function savePasswordsToFirestore(passwords: Record<string, string>): Promise<boolean> {
  try {
    const passDocRef = doc(db, PASSWORDS_DOC_PATH[0], PASSWORDS_DOC_PATH[1]);
    await setDoc(passDocRef, passwords);
    return true;
  } catch (e) {
    console.error('Error saving passwords to Firestore:', e);
    return false;
  }
}

// Real-time subscription to History (Archived Weeks)
export function subscribeToHistory(onData: (history: ArchivedWeek[]) => void): () => void {
  const historyColRef = collection(db, 'history');

  const unsubscribe = onSnapshot(
    historyColRef,
    (snapshot) => {
      const items: ArchivedWeek[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ArchivedWeek);
      });
      // Sort history by archivedAt descending
      items.sort((a, b) => new Date(b.archivedAt || 0).getTime() - new Date(a.archivedAt || 0).getTime());
      onData(items);
    },
    (error) => {
      console.error('Firestore history snapshot error:', error);
    }
  );

  return unsubscribe;
}

export async function saveArchivedWeekToFirestore(week: ArchivedWeek): Promise<boolean> {
  try {
    const docRef = doc(db, 'history', week.id);
    await setDoc(docRef, week);
    return true;
  } catch (e) {
    console.error('Error saving archived week to Firestore:', e);
    return false;
  }
}

export async function deleteArchivedWeekFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'history', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error('Error deleting archived week from Firestore:', e);
    return false;
  }
}

export async function resetScheduleInFirestore(): Promise<boolean> {
  try {
    const scheduleDocRef = doc(db, SCHEDULE_DOC_PATH[0], SCHEDULE_DOC_PATH[1]);
    await setDoc(scheduleDocRef, INITIAL_SCHEDULE_DATA);
    return true;
  } catch (e) {
    console.error('Error resetting schedule in Firestore:', e);
    return false;
  }
}
