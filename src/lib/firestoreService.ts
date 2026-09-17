import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db, auth, getCurrentUserId } from './firebase';
import { 
  Task, 
  DailyLog, 
  StudySession, 
  ExerciseLog, 
  MealLog, 
  Goal, 
  PurchaseItem, 
  HabitChallenge, 
  EmergencyNote,
  UserProfile 
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Info:', JSON.stringify(errInfo));
}

export interface CloudUserData {

  tasks: Task[];
  dailyLogs: Record<string, DailyLog>;
  studySessions: StudySession[];
  exerciseLogs: ExerciseLog[];
  mealLogs: MealLog[];
  goals: Goal[];
  purchases: PurchaseItem[];
  habitChallenges: HabitChallenge[];
  emergencyNotes?: EmergencyNote[];
  profile?: UserProfile;
}

/**
 * Fetch all personal data for the given user from Cloud Firestore.
 * Strictly scopes to `users/{userId}/...` so each user only sees their own data.
 */
export async function fetchUserCloudData(explicitUserId?: string): Promise<{ data: CloudUserData; hasData: boolean }> {
  const userId = explicitUserId || getCurrentUserId();
  if (!userId) {
    return {
      hasData: false,
      data: {
        tasks: [],
        dailyLogs: {},
        studySessions: [],
        exerciseLogs: [],
        mealLogs: [],
        goals: [],
        purchases: [],
        habitChallenges: [],
        emergencyNotes: [],
      }
    };
  }

  const userDocRef = doc(db, 'users', userId);
  const tasksCol = collection(db, 'users', userId, 'tasks');
  const dailyLogsCol = collection(db, 'users', userId, 'dailyLogs');
  const studyCol = collection(db, 'users', userId, 'studySessions');
  const exerciseCol = collection(db, 'users', userId, 'exerciseLogs');
  const mealCol = collection(db, 'users', userId, 'mealLogs');
  const goalsCol = collection(db, 'users', userId, 'goals');
  const purchasesCol = collection(db, 'users', userId, 'purchases');
  const challengesCol = collection(db, 'users', userId, 'habitChallenges');
  const emergencyNotesCol = collection(db, 'users', userId, 'emergencyNotes');

  try {
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
      notesSnap,
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
      getDocs(emergencyNotesCol),
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

    const emergencyNotes: EmergencyNote[] = [];
    notesSnap.forEach((d) => emergencyNotes.push({ ...(d.data() as EmergencyNote), id: d.id }));

    // hasData is true if user profile document exists in Firestore or if any subcollections contain records
    const hasData = 
      userDocSnap.exists() ||
      !!profile ||
      tasks.length > 0 ||
      Object.keys(dailyLogs).length > 0 ||
      studySessions.length > 0 ||
      exerciseLogs.length > 0 ||
      mealLogs.length > 0 ||
      goals.length > 0 ||
      purchases.length > 0 ||
      habitChallenges.length > 0 ||
      emergencyNotes.length > 0;

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
        emergencyNotes,
        profile,
      },
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    return {
      hasData: false,
      data: {
        tasks: [],
        dailyLogs: {},
        studySessions: [],
        exerciseLogs: [],
        mealLogs: [],
        goals: [],
        purchases: [],
        habitChallenges: [],
        emergencyNotes: [],
      }
    };
  }
}

/**
 * Backup / Sync user's state to Firestore under `users/{userId}`.
 * Strictly isolates writes so users never overwrite another user's personal documents.
 */
export async function saveAllUserDataToCloud(data: CloudUserData, explicitUserId?: string): Promise<void> {
  const userId = explicitUserId || getCurrentUserId();
  if (!userId) return;

  try {
    // Update user profile document timestamp & profile details
    await setDoc(
      doc(db, 'users', userId),
      {
        profile: data.profile,
        userId,
        lastSyncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Sync subcollection helper function to ensure deleted items are purged from Firestore
    const syncSubcollection = async (
      collectionName: string,
      itemsMapOrArray: any[] | Record<string, any>
    ) => {
      const items = Array.isArray(itemsMapOrArray)
        ? itemsMapOrArray
        : Object.values(itemsMapOrArray);

      const colRef = collection(db, 'users', userId, collectionName);
      const existingSnap = await getDocs(colRef);
      const batch = writeBatch(db);

      const currentIds = new Set(
        items.map((item) => item.id || item.date)
      );

      // Delete removed items from Firestore
      existingSnap.forEach((d) => {
        if (!currentIds.has(d.id)) {
          batch.delete(d.ref);
        }
      });

      // Save/Update current items
      items.forEach((item) => {
        const id = item.id || item.date;
        if (id) {
          const itemRef = doc(db, 'users', userId, collectionName, id);
          batch.set(itemRef, { ...item, userId }, { merge: true });
        }
      });

      await batch.commit();
    };

    await Promise.all([
      syncSubcollection('tasks', data.tasks),
      syncSubcollection('dailyLogs', data.dailyLogs),
      syncSubcollection('studySessions', data.studySessions),
      syncSubcollection('exerciseLogs', data.exerciseLogs),
      syncSubcollection('mealLogs', data.mealLogs),
      syncSubcollection('goals', data.goals),
      syncSubcollection('purchases', data.purchases),
      syncSubcollection('habitChallenges', data.habitChallenges),
      syncSubcollection('emergencyNotes', data.emergencyNotes || []),
    ]);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}

/**
 * Remove an item from a user's subcollection in Firestore
 */
export async function deleteCloudItem(collectionName: string, docId: string, explicitUserId?: string): Promise<void> {
  try {
    const userId = explicitUserId || getCurrentUserId();
    if (!userId) return;
    const docRef = doc(db, 'users', userId, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `users/${explicitUserId || 'me'}/${collectionName}/${docId}`);
  }
}
