import React, { useState, useEffect, useRef } from 'react';
import { 
  Task, 
  DailyLog, 
  StudySession, 
  ExerciseLog, 
  MealLog, 
  Goal, 
  PurchaseItem, 
  HabitChallenge, 
  LadderStage, 
  ActiveTab, 
  UserProfile,
  EmergencyNote
} from './types';
import { 
  loadStoredData, 
  saveStoredData, 
  STORAGE_KEYS, 
  defaultTasks, 
  defaultDailyLogs, 
  defaultStudySessions, 
  defaultExerciseLogs, 
  defaultMealLogs, 
  defaultGoals, 
  defaultPurchases, 
  defaultHabitChallenges, 
  defaultEmergencyNotes,
  defaultUserProfile,
  createDefaultUserProfile
} from './utils/storage';
import { getTodayDateString, shiftDate, getCurrentTimeString } from './utils/date';
import { 
  fetchUserCloudData, 
  saveAllUserDataToCloud, 
  deleteCloudItem 
} from './lib/firestoreService';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { FileText } from 'lucide-react';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HabitLadderDashboard } from './components/HabitLadderDashboard';
import { WakeSleepTracker } from './components/WakeSleepTracker';
import { StudyExerciseTracker } from './components/StudyExerciseTracker';
import { FoodHealthTracker } from './components/FoodHealthTracker';
import { GoalManager } from './components/GoalManager';
import { PurchasePlanner } from './components/PurchasePlanner';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { HabitMatrixSheet } from './components/HabitMatrixSheet';
import { QuickAddModal } from './components/QuickAddModal';
import { ProfileSection } from './components/ProfileSection';
import { LoginPage } from './components/LoginPage';
import { EmergencyNotesSection } from './components/EmergencyNotesSection';
import { EmergencyQuickModal } from './components/EmergencyQuickModal';

import { NotificationModal } from './components/NotificationModal';
import { InAppNotificationBanner } from './components/InAppNotificationBanner';
import { 
  NotificationSettings, 
  defaultNotificationSettings, 
  evaluateScheduledReminders 
} from './utils/notifications';

export default function App() {
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [activeTab, setActiveTab] = useState<ActiveTab>('habit_matrix');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const isInitialCloudLoadDone = useRef(false);

  // Auth User State
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if previously logged in
    const session = loadStoredData<boolean>(STORAGE_KEYS.AUTH_SESSION, false);
    return session || !!auth.currentUser;
  });

  const currentUserId = currentFirebaseUser?.uid;

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() =>
    loadStoredData(STORAGE_KEYS.NOTIFICATION_SETTINGS, defaultNotificationSettings, currentUserId)
  );

  // Primary User Isolated Lifestyle State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    loadStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile, currentUserId)
  );
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadStoredData(STORAGE_KEYS.TASKS, defaultTasks, currentUserId)
  );
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => 
    loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs, currentUserId)
  );
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => 
    loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions, currentUserId)
  );
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => 
    loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs, currentUserId)
  );
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => 
    loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs, currentUserId)
  );
  const [goals, setGoals] = useState<Goal[]>(() => 
    loadStoredData(STORAGE_KEYS.GOALS, defaultGoals, currentUserId)
  );
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => 
    loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases, currentUserId)
  );
  const [habitChallenges, setHabitChallenges] = useState<HabitChallenge[]>(() => 
    loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges, currentUserId)
  );
  const [emergencyNotes, setEmergencyNotes] = useState<EmergencyNote[]>(() => 
    loadStoredData(STORAGE_KEYS.EMERGENCY_NOTES, defaultEmergencyNotes, currentUserId)
  );

  /**
   * Listen to Firebase Auth state.
   * When auth state changes or a different user logs in, reload and isolate that specific user's data.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentFirebaseUser(user);
        setIsAuthenticated(true);
        saveStoredData(STORAGE_KEYS.AUTH_SESSION, true);

        // Update URL path to /home if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/home')) {
          try {
            window.history.pushState(null, '', '/home');
          } catch {
            // fallback
          }
        }

        // Fetch this user's isolated data from Cloud Firestore if not already loaded for this user
        if (!isInitialCloudLoadDone.current) {
          setCloudSyncStatus('syncing');
          try {
            const { data, hasData } = await fetchUserCloudData(user.uid);
            if (hasData) {
              // Cloud has data for this specific user - load it
              const profile = data.profile || createDefaultUserProfile(user.displayName || user.email?.split('@')[0] || 'My Profile', user.email || '');
              setUserProfile(profile);
              setTasks(data.tasks || []);
              setDailyLogs(data.dailyLogs || {});
              setStudySessions(data.studySessions || []);
              setExerciseLogs(data.exerciseLogs || []);
              setMealLogs(data.mealLogs || []);
              setGoals(data.goals || []);
              setPurchases(data.purchases || []);
              setHabitChallenges(data.habitChallenges || []);
              setEmergencyNotes(data.emergencyNotes || []);

              // Also mirror to user-scoped local storage
              saveStoredData(STORAGE_KEYS.USER_PROFILE, profile, user.uid);
              saveStoredData(STORAGE_KEYS.TASKS, data.tasks || [], user.uid);
              saveStoredData(STORAGE_KEYS.DAILY_LOGS, data.dailyLogs || {}, user.uid);
              saveStoredData(STORAGE_KEYS.STUDY_SESSIONS, data.studySessions || [], user.uid);
              saveStoredData(STORAGE_KEYS.EXERCISE_LOGS, data.exerciseLogs || [], user.uid);
              saveStoredData(STORAGE_KEYS.MEAL_LOGS, data.mealLogs || [], user.uid);
              saveStoredData(STORAGE_KEYS.GOALS, data.goals || [], user.uid);
              saveStoredData(STORAGE_KEYS.PURCHASES, data.purchases || [], user.uid);
              saveStoredData(STORAGE_KEYS.HABIT_CHALLENGES, data.habitChallenges || [], user.uid);
              saveStoredData(STORAGE_KEYS.EMERGENCY_NOTES, data.emergencyNotes || [], user.uid);
            } else {
              // New user without cloud records yet: load their user-scoped local storage or fresh templates
              const userCachedProfile = loadStoredData<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null, user.uid);
              const initialProfile = userCachedProfile || createDefaultUserProfile(
                user.displayName || (user.email ? user.email.split('@')[0] : 'My Profile'),
                user.email || ''
              );
              const initialTasks = loadStoredData(STORAGE_KEYS.TASKS, defaultTasks, user.uid);
              const initialDailyLogs = loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs, user.uid);
              const initialStudy = loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions, user.uid);
              const initialExercise = loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs, user.uid);
              const initialMeal = loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs, user.uid);
              const initialGoals = loadStoredData(STORAGE_KEYS.GOALS, defaultGoals, user.uid);
              const initialPurchases = loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases, user.uid);
              const initialChallenges = loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges, user.uid);
              const initialNotes = loadStoredData(STORAGE_KEYS.EMERGENCY_NOTES, defaultEmergencyNotes, user.uid);

              setUserProfile(initialProfile);
              setTasks(initialTasks);
              setDailyLogs(initialDailyLogs);
              setStudySessions(initialStudy);
              setExerciseLogs(initialExercise);
              setMealLogs(initialMeal);
              setGoals(initialGoals);
              setPurchases(initialPurchases);
              setHabitChallenges(initialChallenges);
              setEmergencyNotes(initialNotes);

              // Seed user's private Firestore document
              await saveAllUserDataToCloud({
                tasks: initialTasks,
                dailyLogs: initialDailyLogs,
                studySessions: initialStudy,
                exerciseLogs: initialExercise,
                mealLogs: initialMeal,
                goals: initialGoals,
                purchases: initialPurchases,
                habitChallenges: initialChallenges,
                emergencyNotes: initialNotes,
                profile: initialProfile,
              }, user.uid);
            }
            setCloudSyncStatus('synced');
          } catch (err) {
            console.warn('Firebase user sync status: using local cache', err);
            setCloudSyncStatus('offline');
          } finally {
            isInitialCloudLoadDone.current = true;
            setIsInitialLoading(false);
          }
        }
      } else {
        // Logged out
        setCurrentFirebaseUser(null);
        setIsAuthenticated(false);
        saveStoredData(STORAGE_KEYS.AUTH_SESSION, false);
        setIsInitialLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save changes to user-scoped LocalStorage on state updates
  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.AUTH_SESSION, isAuthenticated); 
  }, [isAuthenticated]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.USER_PROFILE, userProfile, currentUserId); 
  }, [userProfile, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.TASKS, tasks, currentUserId); 
  }, [tasks, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.DAILY_LOGS, dailyLogs, currentUserId); 
  }, [dailyLogs, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.STUDY_SESSIONS, studySessions, currentUserId); 
  }, [studySessions, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.EXERCISE_LOGS, exerciseLogs, currentUserId); 
  }, [exerciseLogs, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.MEAL_LOGS, mealLogs, currentUserId); 
  }, [mealLogs, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.GOALS, goals, currentUserId); 
  }, [goals, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.PURCHASES, purchases, currentUserId); 
  }, [purchases, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.HABIT_CHALLENGES, habitChallenges, currentUserId); 
  }, [habitChallenges, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.EMERGENCY_NOTES, emergencyNotes, currentUserId); 
  }, [emergencyNotes, currentUserId]);

  useEffect(() => { 
    saveStoredData(STORAGE_KEYS.NOTIFICATION_SETTINGS, notificationSettings, currentUserId); 
  }, [notificationSettings, currentUserId]);

  // Background ticker for scheduled task alerts, wake up time, and sleep time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const logToday = dailyLogs[selectedDate] || dailyLogs[today];
      evaluateScheduledReminders(tasks, logToday, notificationSettings);
    }, 20000);

    const logToday = dailyLogs[selectedDate] || dailyLogs[today];
    evaluateScheduledReminders(tasks, logToday, notificationSettings);

    return () => clearInterval(interval);
  }, [tasks, dailyLogs, selectedDate, today, notificationSettings]);

  // Debounced auto-sync to Firestore for the currently active user
  useEffect(() => {
    if (!isInitialCloudLoadDone.current || !currentUserId) return;

    const timeout = setTimeout(async () => {
      try {
        setCloudSyncStatus('syncing');
        await saveAllUserDataToCloud({
          tasks,
          dailyLogs,
          studySessions,
          exerciseLogs,
          mealLogs,
          goals,
          purchases,
          habitChallenges,
          emergencyNotes,
          profile: userProfile,
        }, currentUserId);
        setCloudSyncStatus('synced');
      } catch (err) {
        console.error('Auto sync to Firestore failed:', err);
        setCloudSyncStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [tasks, dailyLogs, studySessions, exerciseLogs, mealLogs, goals, purchases, habitChallenges, emergencyNotes, userProfile, currentUserId]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      saveStoredData(STORAGE_KEYS.AUTH_SESSION, false);
      setIsAuthenticated(false);
      setCurrentFirebaseUser(null);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Login Handler from LoginPage
  const handleSuccessLogin = (profile: UserProfile, fbUser?: FirebaseUser) => {
    if (fbUser) {
      setCurrentFirebaseUser(fbUser);
    }
    setUserProfile(profile);
    setIsAuthenticated(true);
    saveStoredData(STORAGE_KEYS.AUTH_SESSION, true);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/home');
    }
  };

  // Manual Firestore sync trigger
  const handleManualCloudSync = async () => {
    if (!currentUserId) {
      alert('You are currently working in local-first mode. Sign in to cloud sync across devices.');
      return;
    }
    setCloudSyncStatus('syncing');
    try {
      await saveAllUserDataToCloud({
        tasks,
        dailyLogs,
        studySessions,
        exerciseLogs,
        mealLogs,
        goals,
        purchases,
        habitChallenges,
        emergencyNotes,
        profile: userProfile,
      }, currentUserId);
      setCloudSyncStatus('synced');
      alert('All your personal habits and emergency notes are securely synced to your cloud account!');
    } catch (err) {
      console.error('Manual Firestore sync error:', err);
      setCloudSyncStatus('offline');
      alert('Cloud sync failed. Data is safely stored in your browser.');
    }
  };

  // Profile Update Handler
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updated };
      return next;
    });
  };

  // Task Handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completedDates' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      completedDates: {},
      createdAt: today,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (taskId: string, date: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const realToday = getTodayDateString();
          const taskCreatedDate = (t.createdAt || realToday).split('T')[0];
          if (date < taskCreatedDate || date > realToday) {
            // Cannot mark completed on dates prior to task creation OR future dates
            return t;
          }
          const isDone = !!t.completedDates[date];
          const newDates = { ...t.completedDates };
          if (isDone) {
            delete newDates[date];
          } else {
            newDates[date] = true;
          }
          return { ...t, completedDates: newDates };
        }
        return t;
      })
    );
  };

  const handleUpdateTask = (taskId: string, partial: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...partial } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (currentUserId) deleteCloudItem('tasks', taskId, currentUserId);
  };

  const handleReorderTasks = (reordered: Task[]) => {
    setTasks(reordered);
  };

  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === taskId);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const newTasks = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const temp = newTasks[idx];
      newTasks[idx] = newTasks[targetIdx];
      newTasks[targetIdx] = temp;
      return newTasks;
    });
  };

  // Daily Log Handlers
  const currentDailyLog: DailyLog = dailyLogs[selectedDate] || {
    date: selectedDate,
    targetWakeTime: '06:00',
    actualWakeTime: '',
    targetSleepTime: '22:00',
    actualSleepTime: '',
    sleptEarly: false,
    sleepQuality: 4,
    mood: 4,
    energyLevel: 4,
    waterIntakeMl: 0,
    waterGoalMl: 3000,
    digestionStatus: 'okay',
    gutComfortRating: 4,
    notes: '',
  };

  const handleUpdateDailyLog = (updated: Partial<DailyLog>) => {
    setDailyLogs((prev) => ({
      ...prev,
      [selectedDate]: {
        ...currentDailyLog,
        ...updated,
        date: selectedDate,
      },
    }));
  };

  const handleAddWater = (amountMl: number) => {
    const current = currentDailyLog.waterIntakeMl || 0;
    handleUpdateDailyLog({ waterIntakeMl: Math.max(0, current + amountMl) });
  };

  // Calculate Early Sleep Streak
  const earlySleepStreak = React.useMemo(() => {
    let streak = 0;
    let checkDate = today;
    for (let i = 0; i < 60; i++) {
      const log = dailyLogs[checkDate];
      if (log && log.sleptEarly) {
        streak++;
        checkDate = shiftDate(checkDate, -1);
      } else {
        if (i === 0 && (!log || !log.actualSleepTime)) {
          checkDate = shiftDate(checkDate, -1);
          continue;
        }
        break;
      }
    }
    return streak;
  }, [dailyLogs, today]);

  // Study Session Handlers
  const handleAddStudySession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `s-${Date.now()}`,
    };
    setStudySessions((prev) => [newSession, ...prev]);
  };

  const handleToggleStudySession = (id: string) => {
    setStudySessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteStudySession = (id: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
    if (currentUserId) deleteCloudItem('studySessions', id, currentUserId);
  };

  // Exercise Handlers
  const handleAddExerciseLog = (exerciseData: Omit<ExerciseLog, 'id'>) => {
    const newExercise: ExerciseLog = {
      ...exerciseData,
      id: `e-${Date.now()}`,
    };
    setExerciseLogs((prev) => [newExercise, ...prev]);
  };

  const handleToggleExerciseLog = (id: string) => {
    setExerciseLogs((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteExerciseLog = (id: string) => {
    setExerciseLogs((prev) => prev.filter((e) => e.id !== id));
    if (currentUserId) deleteCloudItem('exerciseLogs', id, currentUserId);
  };

  // Meal Handler
  const handleAddMealLog = (mealData: Omit<MealLog, 'id'>) => {
    const newMeal: MealLog = {
      ...mealData,
      id: `m-${Date.now()}`,
    };
    setMealLogs((prev) => [newMeal, ...prev]);
  };

  const handleDeleteMealLog = (id: string) => {
    setMealLogs((prev) => prev.filter((m) => m.id !== id));
    if (currentUserId) deleteCloudItem('mealLogs', id, currentUserId);
  };

  // Goal Handlers
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
      createdAt: today,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleUpdateGoal = (goalId: string, partial: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, ...partial } : g))
    );
  };

  const handleToggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const milestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = milestones.filter((m) => m.completed).length;
          const progress = Math.round((completedCount / milestones.length) * 100);
          return {
            ...g,
            milestones,
            progress,
            status: progress === 100 ? 'completed' : 'in_progress',
          };
        }
        return g;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    if (currentUserId) deleteCloudItem('goals', goalId, currentUserId);
  };

  // Purchase Handlers
  const handleAddPurchase = (purchaseData: Omit<PurchaseItem, 'id' | 'createdAt'>) => {
    const newPurchase: PurchaseItem = {
      ...purchaseData,
      id: `p-${Date.now()}`,
      createdAt: today,
    };
    setPurchases((prev) => [newPurchase, ...prev]);
  };

  const handleUpdatePurchaseStatus = (id: string, status: PurchaseItem['status']) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    if (currentUserId) deleteCloudItem('purchases', id, currentUserId);
  };

  // Notes Handlers
  const handleAddEmergencyNote = (noteData: Omit<EmergencyNote, 'id' | 'createdAt'>) => {
    const noteDate = noteData.date || today;
    const noteTime = noteData.time || getCurrentTimeString();
    const newNote: EmergencyNote = {
      ...noteData,
      id: `n-${Date.now()}`,
      date: noteDate,
      time: noteTime,
      createdAt: noteDate,
    };
    setEmergencyNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateEmergencyNote = (id: string, partial: Partial<EmergencyNote>) => {
    setEmergencyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...partial } : n))
    );
  };

  const handleDeleteEmergencyNote = (id: string) => {
    setEmergencyNotes((prev) => prev.filter((n) => n.id !== id));
    if (currentUserId) deleteCloudItem('emergencyNotes', id, currentUserId);
  };

  const handleToggleEmergencyNoteComplete = (id: string) => {
    setEmergencyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isCompleted: !n.isCompleted } : n))
    );
  };

  // Habit Challenge Handlers
  const handleToggleChallengeDate = (challengeId: string, date: string) => {
    setHabitChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const hasDate = c.completedDates.includes(date);
          const updatedDates = hasDate
            ? c.completedDates.filter((d) => d !== date)
            : [...c.completedDates, date];
          return { ...c, completedDates: updatedDates };
        }
        return c;
      })
    );
  };

  const handleAdvanceChallengeStage = (challengeId: string) => {
    setHabitChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          let newStage: LadderStage = '6_day';
          let newTargetDays = 6;
          let newTip = 'Stage 2 (6 Days): Your brain has locked in momentum! Notice how much lighter doing this habit feels today.';

          if (c.targetDays === 6) {
            newStage = '11_day';
            newTargetDays = 11;
            newTip = 'Stage 3 (11 Days): Neuro-lock active! Myelination is sealing this action into your neural baseline.';
          } else if (c.targetDays >= 11) {
            newStage = '21_day';
            newTargetDays = c.targetDays + 5;
            newTip = 'Stage 4 (Continuous Ascension): Unlocked continuous expansion horizon! You are operating at peak consistency.';
          }

          return {
            ...c,
            currentStage: newStage,
            targetDays: newTargetDays,
            brainComfortTip: newTip,
          };
        }
        return c;
      })
    );
  };

  const handleAddChallenge = (challengeData: Omit<HabitChallenge, 'id'>) => {
    const newChallenge: HabitChallenge = {
      ...challengeData,
      id: `hc-${Date.now()}`,
    };
    setHabitChallenges((prev) => [newChallenge, ...prev]);
  };

  const handleResetChallengeProgress = (challengeId: string) => {
    setHabitChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, completedDates: [], targetDays: 3, currentStage: '3_day' } : c))
    );
  };

  const handleDeleteChallenge = (challengeId: string) => {
    setHabitChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    if (currentUserId) deleteCloudItem('habitChallenges', challengeId, currentUserId);
  };

  const handleDataRefresh = () => {
    setTasks(loadStoredData(STORAGE_KEYS.TASKS, defaultTasks, currentUserId));
    setDailyLogs(loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs, currentUserId));
    setStudySessions(loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions, currentUserId));
    setExerciseLogs(loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs, currentUserId));
    setMealLogs(loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs, currentUserId));
    setGoals(loadStoredData(STORAGE_KEYS.GOALS, defaultGoals, currentUserId));
    setPurchases(loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases, currentUserId));
    setHabitChallenges(loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges, currentUserId));
    setEmergencyNotes(loadStoredData(STORAGE_KEYS.EMERGENCY_NOTES, defaultEmergencyNotes, currentUserId));
    setUserProfile(loadStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile, currentUserId));
  };

  // If user is not authenticated, show ONLY the Landing Login Page
  if (!isAuthenticated) {
    return (
      <LoginPage
        onSuccessLogin={handleSuccessLogin}
      />
    );
  }

  // Quick stats for Header
  const pendingTasksCount = tasks.filter((t) => !t.completedDates[selectedDate]).length;
  const completedTasksCount = tasks.filter((t) => !!t.completedDates[selectedDate]).length;
  const todayCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const todayStudyMins = studySessions
    .filter((s) => s.date === selectedDate && s.completed)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const pendingEmergencyNotesCount = emergencyNotes.filter((n) => !n.isCompleted).length;

  // Authenticated App Shell (at /home)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white relative">
      
      {/* Top Header */}
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        earlySleepStreak={earlySleepStreak}
        todayCompletionRate={todayCompletionRate}
        waterIntakeMl={currentDailyLog.waterIntakeMl || 0}
        waterGoalMl={currentDailyLog.waterGoalMl || 3000}
        todayStudyMins={todayStudyMins}
        onDataRefresh={handleDataRefresh}
        cloudSyncStatus={cloudSyncStatus}
        onManualCloudSync={handleManualCloudSync}
        userProfile={userProfile}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onLogout={handleLogout}
        userId={currentUserId}
      />

      {/* Left Navigation Sidebar + Main View Container */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-61px)]">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTasksCount={pendingTasksCount}
          userName={userProfile.name}
          emergencyNotesCount={pendingEmergencyNotesCount}
        />

        {/* Main Content Body */}
        <main className="flex-1 overflow-x-hidden p-2.5 sm:p-5 lg:p-8 max-w-7xl">
          {activeTab === 'notes' && (
            <EmergencyNotesSection
              notes={emergencyNotes}
              onAddNote={handleAddEmergencyNote}
              onUpdateNote={handleUpdateEmergencyNote}
              onDeleteNote={handleDeleteEmergencyNote}
              onToggleComplete={handleToggleEmergencyNoteComplete}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              cloudSyncStatus={cloudSyncStatus}
              onManualCloudSync={handleManualCloudSync}
            />
          )}

          {activeTab === 'habit_matrix' && (
            <HabitMatrixSheet
              tasks={tasks}
              selectedDate={selectedDate}
              onToggleTask={handleToggleTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
              onReorderTasks={handleReorderTasks}
              onMoveTask={handleMoveTask}
            />
          )}

          {activeTab === 'habit_ladder' && (
            <HabitLadderDashboard
              challenges={habitChallenges}
              onToggleDate={handleToggleChallengeDate}
              onAdvanceStage={handleAdvanceChallengeStage}
              onAddChallenge={handleAddChallenge}
              onResetProgress={handleResetChallengeProgress}
              onDeleteChallenge={handleDeleteChallenge}
            />
          )}

          {activeTab === 'wake_sleep' && (
            <WakeSleepTracker
              selectedDate={selectedDate}
              dailyLog={currentDailyLog}
              onUpdateLog={handleUpdateDailyLog}
              earlySleepStreak={earlySleepStreak}
            />
          )}

          {activeTab === 'study_exercise' && (
            <StudyExerciseTracker
              selectedDate={selectedDate}
              studySessions={studySessions}
              exerciseLogs={exerciseLogs}
              onAddStudySession={handleAddStudySession}
              onToggleStudySession={handleToggleStudySession}
              onDeleteStudySession={handleDeleteStudySession}
              onAddExerciseLog={handleAddExerciseLog}
              onToggleExerciseLog={handleToggleExerciseLog}
              onDeleteExerciseLog={handleDeleteExerciseLog}
            />
          )}

          {activeTab === 'food_health' && (
            <FoodHealthTracker
              selectedDate={selectedDate}
              dailyLog={currentDailyLog}
              mealLogs={mealLogs}
              onUpdateLog={handleUpdateDailyLog}
              onAddMeal={handleAddMealLog}
              onDeleteMealLog={handleDeleteMealLog}
              onAddWater={handleAddWater}
            />
          )}

          {activeTab === 'goals' && (
            <GoalManager
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onToggleMilestone={handleToggleGoalMilestone}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasePlanner
              purchases={purchases}
              onAddPurchase={handleAddPurchase}
              onUpdateStatus={handleUpdatePurchaseStatus}
              onDeletePurchase={handleDeletePurchase}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsOverview
              dailyLogs={dailyLogs}
              tasks={tasks}
              studySessions={studySessions}
              exerciseLogs={exerciseLogs}
              goals={goals}
              purchases={purchases}
            />
          )}
        </main>
      </div>

      {/* Floating Quick Note Button (visible prominently on phone view) */}
      <div className="fixed bottom-5 right-5 z-40 md:hidden flex flex-col items-end gap-1.5">
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl flex items-center justify-center border-2 border-white active:scale-95 transition-all cursor-pointer relative"
          title="Add Quick Note"
          aria-label="Add Quick Note"
        >
          <FileText className="w-6 h-6" />
          {emergencyNotes.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-950 text-white rounded-full text-[10px] font-black border-2 border-white flex items-center justify-center">
              {emergencyNotes.length}
            </span>
          )}
        </button>
        <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs">
          New Note 📝
        </span>
      </div>

      {/* Floating Emergency Quick Modal */}
      <EmergencyQuickModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onAddNote={handleAddEmergencyNote}
      />

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
      />

      {/* Floating In-App Toast Notification Banner */}
      <InAppNotificationBanner />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        selectedDate={selectedDate}
        onAddTask={handleAddTask}
        onAddStudySession={handleAddStudySession}
        onAddExerciseLog={handleAddExerciseLog}
        onAddMeal={handleAddMealLog}
        onAddGoal={handleAddGoal}
        onAddPurchase={handleAddPurchase}
      />
    </div>
  );
}
