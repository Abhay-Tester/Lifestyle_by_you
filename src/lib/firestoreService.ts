import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db, getOrCreateClientUserId } from './firebase';
import { 
  Task, 
  DailyLog, 
  StudySession, 
  ExerciseLog, 
  MealLog, 
  Goal, 
  PurchaseItem, 
  HabitChallenge,
  UserProfile
} from '../types';

export interface CloudUserData {
  tasks: Task[];
  dailyLogs: Record<string, DailyLog>;
  studySessions: StudySession[];
  exerciseLogs: ExerciseLog[];
  mealLogs: MealLog[];
  goals: Goal[];
  purchases: PurchaseItem[];
  habitChallenges: HabitChallenge[];
  profile?: UserProfile;
}

/**
 * Fetch all data for the user from Cloud Firestore
 */
export async function fetchUserCloudData(): Promise<{ data: CloudUserData; hasData: boolean }> {
  const userId = getOrCreateClientUserId();

  const userDocRef = doc(db, 'users', userId);
  const tasksCol = collection(db, 'users', userId, 'tasks');
  const dailyLogsCol = collection(db, 'users', userId, 'dailyLogs');
  const studyCol = collection(db, 'users', userId, 'studySessions');
  const exerciseCol = collection(db, 'users', userId, 'exerciseLogs');
  const mealCol = collection(db, 'users', userId, 'mealLogs');
  const goalsCol = collection(db, 'users', userId, 'goals');
  const purchasesCol = collection(db, 'users', userId, 'purchases');
  const challengesCol = collection(db, 'users', userId, 'habitChallenges');

  const [
    userDocSnap,
    tasksSnap,
    dailyLogsSnap,
    studySnap,
    exerciseSnap,
    mealSnap,
    goalsSnap,
    purchasesSnap,
    challengesSnap,
  ] = await Promise.all([
    getDoc(userDocRef),
    getDocs(tasksCol),
    getDocs(dailyLogsCol),
    getDocs(studyCol),
    getDocs(exerciseCol),
    getDocs(mealCol),
    getDocs(goalsCol),
    getDocs(purchasesCol),
    getDocs(challengesCol),
  ]);

  const profile = userDocSnap.exists() ? (userDocSnap.data()?.profile as UserProfile | undefined) : undefined;

  const tasks: Task[] = [];
  tasksSnap.forEach((d) => tasks.push({ ...(d.data() as Task), id: d.id }));

  const dailyLogs: Record<string, DailyLog> = {};
  dailyLogsSnap.forEach((d) => {
    const data = d.data() as DailyLog;
    dailyLogs[data.date || d.id] = data;
  });

  const studySessions: StudySession[] = [];
  studySnap.forEach((d) => studySessions.push({ ...(d.data() as StudySession), id: d.id }));

  const exerciseLogs: ExerciseLog[] = [];
  exerciseSnap.forEach((d) => exerciseLogs.push({ ...(d.data() as ExerciseLog), id: d.id }));

  const mealLogs: MealLog[] = [];
  mealSnap.forEach((d) => mealLogs.push({ ...(d.data() as MealLog), id: d.id }));

  const goals: Goal[] = [];
  goalsSnap.forEach((d) => goals.push({ ...(d.data() as Goal), id: d.id }));

  const purchases: PurchaseItem[] = [];
  purchasesSnap.forEach((d) => purchases.push({ ...(d.data() as PurchaseItem), id: d.id }));

  const habitChallenges: HabitChallenge[] = [];
  challengesSnap.forEach((d) => habitChallenges.push({ ...(d.data() as HabitChallenge), id: d.id }));

  const hasData = 
    !!profile ||
    tasks.length > 0 ||
    Object.keys(dailyLogs).length > 0 ||
    studySessions.length > 0 ||
    exerciseLogs.length > 0 ||
    mealLogs.length > 0 ||
    goals.length > 0 ||
    purchases.length > 0 ||
    habitChallenges.length > 0;

  return {
    hasData,
    data: {
      tasks,
      dailyLogs,
      studySessions,
      exerciseLogs,
      mealLogs,
      goals,
      purchases,
      habitChallenges,
      profile,
    },
  };
}

/**
 * Backup / Sync all current local state to Firestore for persistent cloud storage
 */
export async function saveAllUserDataToCloud(data: CloudUserData): Promise<void> {
  const userId = getOrCreateClientUserId();

  // Update user profile document timestamp & profile details
  await setDoc(
    doc(db, 'users', userId),
    {
      profile: data.profile,
      lastSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Sync Tasks
  if (data.tasks.length > 0) {
    const taskBatch = writeBatch(db);
    for (const t of data.tasks) {
      const taskRef = doc(db, 'users', userId, 'tasks', t.id);
      taskBatch.set(taskRef, { ...t, userId });
    }
    await taskBatch.commit();
  }

  // Sync Daily Logs
  const logEntries = Object.entries(data.dailyLogs);
  if (logEntries.length > 0) {
    const logsBatch = writeBatch(db);
    for (const [dateKey, log] of logEntries) {
      const logRef = doc(db, 'users', userId, 'dailyLogs', dateKey);
      logsBatch.set(logRef, { ...log, userId, date: dateKey });
    }
    await logsBatch.commit();
  }

  // Sync Study Sessions
  if (data.studySessions.length > 0) {
    const studyBatch = writeBatch(db);
    for (const s of data.studySessions) {
      const sRef = doc(db, 'users', userId, 'studySessions', s.id);
      studyBatch.set(sRef, { ...s, userId });
    }
    await studyBatch.commit();
  }

  // Sync Exercise Logs
  if (data.exerciseLogs.length > 0) {
    const exBatch = writeBatch(db);
    for (const e of data.exerciseLogs) {
      const eRef = doc(db, 'users', userId, 'exerciseLogs', e.id);
      exBatch.set(eRef, { ...e, userId });
    }
    await exBatch.commit();
  }

  // Sync Meal Logs
  if (data.mealLogs.length > 0) {
    const mBatch = writeBatch(db);
    for (const m of data.mealLogs) {
      const mRef = doc(db, 'users', userId, 'mealLogs', m.id);
      mBatch.set(mRef, { ...m, userId });
    }
    await mBatch.commit();
  }

  // Sync Goals
  if (data.goals.length > 0) {
    const gBatch = writeBatch(db);
    for (const g of data.goals) {
      const gRef = doc(db, 'users', userId, 'goals', g.id);
      gBatch.set(gRef, { ...g, userId });
    }
    await gBatch.commit();
  }

  // Sync Purchases
  if (data.purchases.length > 0) {
    const pBatch = writeBatch(db);
    for (const p of data.purchases) {
      const pRef = doc(db, 'users', userId, 'purchases', p.id);
      pBatch.set(pRef, { ...p, userId });
    }
    await pBatch.commit();
  }

  // Sync Habit Challenges
  if (data.habitChallenges.length > 0) {
    const hcBatch = writeBatch(db);
    for (const hc of data.habitChallenges) {
      const hcRef = doc(db, 'users', userId, 'habitChallenges', hc.id);
      hcBatch.set(hcRef, { ...hc, userId });
    }
    await hcBatch.commit();
  }
}

/**
 * Remove an item from a user's subcollection in Firestore
 */
export async function deleteCloudItem(collectionName: string, docId: string): Promise<void> {
  try {
    const userId = getOrCreateClientUserId();
    const docRef = doc(db, 'users', userId, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting ${collectionName}/${docId}:`, err);
  }
}
