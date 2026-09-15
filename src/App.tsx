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
  UserProfile
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
  defaultUserProfile
} from './utils/storage';
import { getTodayDateString, shiftDate } from './utils/date';
import { 
  fetchUserCloudData, 
  saveAllUserDataToCloud, 
  deleteCloudItem 
} from './lib/firestoreService';

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
import { LoginModal } from './components/LoginModal';

export default function App() {
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [activeTab, setActiveTab] = useState<ActiveTab>('habit_matrix');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const isInitialCloudLoadDone = useRef(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return loadStoredData<boolean>(STORAGE_KEYS.AUTH_SESSION, true);
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(!isAuthenticated);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => 
    loadStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile)
  );

  // Main Persistent States
  const [tasks, setTasks] = useState<Task[]>(() => loadStoredData(STORAGE_KEYS.TASKS, defaultTasks));
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs));
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions));
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>(() => loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs));
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs));
  const [goals, setGoals] = useState<Goal[]>(() => loadStoredData(STORAGE_KEYS.GOALS, defaultGoals));
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases));
  const [habitChallenges, setHabitChallenges] = useState<HabitChallenge[]>(() => loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges));

  // Save changes to LocalStorage on state updates
  useEffect(() => { saveStoredData(STORAGE_KEYS.AUTH_SESSION, isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.USER_PROFILE, userProfile); }, [userProfile]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.DAILY_LOGS, dailyLogs); }, [dailyLogs]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.STUDY_SESSIONS, studySessions); }, [studySessions]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.EXERCISE_LOGS, exerciseLogs); }, [exerciseLogs]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.MEAL_LOGS, mealLogs); }, [mealLogs]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.GOALS, goals); }, [goals]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.PURCHASES, purchases); }, [purchases]);
  useEffect(() => { saveStoredData(STORAGE_KEYS.HABIT_CHALLENGES, habitChallenges); }, [habitChallenges]);

  // Initial cloud sync on startup
  useEffect(() => {
    async function loadCloudData() {
      try {
        setCloudSyncStatus('syncing');
        const { data, hasData } = await fetchUserCloudData();
        if (hasData) {
          // Cloud has existing data - apply to local state
          if (data.profile) setUserProfile(data.profile);
          if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
          if (data.dailyLogs && Object.keys(data.dailyLogs).length > 0) setDailyLogs(data.dailyLogs);
          if (data.studySessions && data.studySessions.length > 0) setStudySessions(data.studySessions);
          if (data.exerciseLogs && data.exerciseLogs.length > 0) setExerciseLogs(data.exerciseLogs);
          if (data.mealLogs && data.mealLogs.length > 0) setMealLogs(data.mealLogs);
          if (data.goals && data.goals.length > 0) setGoals(data.goals);
          if (data.purchases && data.purchases.length > 0) setPurchases(data.purchases);
          if (data.habitChallenges && data.habitChallenges.length > 0) setHabitChallenges(data.habitChallenges);
        } else {
          // First time cloud connection: seed current local state to cloud
          await saveAllUserDataToCloud({
            tasks,
            dailyLogs,
            studySessions,
            exerciseLogs,
            mealLogs,
            goals,
            purchases,
            habitChallenges,
            profile: userProfile,
          });
        }
        setCloudSyncStatus('synced');
      } catch (err) {
        console.warn('Firebase sync status: using local cache', err);
        setCloudSyncStatus('offline');
      } finally {
        isInitialCloudLoadDone.current = true;
      }
    }

    loadCloudData();
  }, []);

  // Debounced auto-sync to Firestore on modifications
  useEffect(() => {
    if (!isInitialCloudLoadDone.current) return;

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
          profile: userProfile,
        });
        setCloudSyncStatus('synced');
      } catch (err) {
        console.error('Auto sync to Firestore failed:', err);
        setCloudSyncStatus('offline');
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [tasks, dailyLogs, studySessions, exerciseLogs, mealLogs, goals, purchases, habitChallenges, userProfile]);

  const handleManualCloudSync = async () => {
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
        profile: userProfile,
      });
      setCloudSyncStatus('synced');
    } catch (err) {
      console.error('Manual Firestore sync error:', err);
      setCloudSyncStatus('offline');
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleSuccessLogin = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
  };

  // Ensure selectedDate has a valid DailyLog object
  const currentDailyLog: DailyLog = dailyLogs[selectedDate] || {
    date: selectedDate,
    targetWakeTime: '06:00',
    actualWakeTime: '06:00',
    targetSleepTime: '22:00',
    actualSleepTime: '',
    sleptEarly: true,
    sleepQuality: 4,
    mood: 4,
    energyLevel: 4,
    waterIntakeMl: 1500,
    waterGoalMl: 3000,
    digestionStatus: 'great',
    gutComfortRating: 5,
    digestionNotes: '',
    notes: '',
  };

  const handleUpdateDailyLog = (date: string, partial: Partial<DailyLog>) => {
    setDailyLogs((prev) => {
      const existing = prev[date] || {
        date,
        targetWakeTime: '06:00',
        actualWakeTime: '06:00',
        targetSleepTime: '22:00',
        actualSleepTime: '',
        sleptEarly: true,
        sleepQuality: 4,
        mood: 4,
        energyLevel: 4,
        waterIntakeMl: 1500,
        waterGoalMl: 3000,
        digestionStatus: 'great',
        gutComfortRating: 5,
        digestionNotes: '',
        notes: '',
      };
      return {
        ...prev,
        [date]: { ...existing, ...partial },
      };
    });
  };

  // Helper to calculate early sleep streak
  const calculateEarlySleepStreak = (): number => {
    let streak = 0;
    let currDate = today;
    for (let i = 0; i < 60; i++) {
      const log = dailyLogs[currDate];
      if (log && log.sleptEarly) {
        streak++;
        currDate = shiftDate(currDate, -1);
      } else {
        break;
      }
    }
    return streak;
  };

  const earlySleepStreak = calculateEarlySleepStreak();

  // Task Handlers
  const handleToggleTask = (taskId: string, date: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedDates = { ...t.completedDates };
          updatedDates[date] = !updatedDates[date];
          return { ...t, completedDates: updatedDates };
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
    deleteCloudItem('tasks', taskId);
  };

  const handleReorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  const handleMoveTask = (taskId: string, direction: 'up' | 'down') => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === taskId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const newTasks = [...prev];
      const [movedTask] = newTasks.splice(index, 1);
      newTasks.splice(targetIndex, 0, movedTask);
      return newTasks;
    });
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completedDates' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      completedDates: {},
      createdAt: today,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Study Handlers
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

  // Meal Handler
  const handleAddMealLog = (mealData: Omit<MealLog, 'id'>) => {
    const newMeal: MealLog = {
      ...mealData,
      id: `m-${Date.now()}`,
    };
    setMealLogs((prev) => [newMeal, ...prev]);
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
          const updatedMilestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
          return {
            ...g,
            milestones: updatedMilestones,
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
    deleteCloudItem('goals', goalId);
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
    deleteCloudItem('purchases', id);
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

  const handleDataRefresh = () => {
    setTasks(loadStoredData(STORAGE_KEYS.TASKS, defaultTasks));
    setDailyLogs(loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs));
    setStudySessions(loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions));
    setExerciseLogs(loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs));
    setMealLogs(loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs));
    setGoals(loadStoredData(STORAGE_KEYS.GOALS, defaultGoals));
    setPurchases(loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases));
    setHabitChallenges(loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges));
    setUserProfile(loadStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile));
  };

  // Quick stats for Header
  const pendingTasksCount = tasks.filter((t) => !t.completedDates[selectedDate]).length;
  const completedTasksCount = tasks.filter((t) => !!t.completedDates[selectedDate]).length;
  const todayCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const todayStudyMins = studySessions
    .filter((s) => s.date === selectedDate && s.completed)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
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
        onLogout={handleLogout}
      />

      {/* Left Navigation Sidebar + Main View Container */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-61px)]">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTasksCount={pendingTasksCount}
          userName={userProfile.name}
        />

        {/* Main Content Body */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl">
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
              selectedDate={selectedDate}
              onToggleDate={handleToggleChallengeDate}
              onAdvanceStage={handleAdvanceChallengeStage}
              onResetProgress={handleResetChallengeProgress}
              onAddChallenge={handleAddChallenge}
            />
          )}

          {activeTab === 'wake_sleep' && (
            <WakeSleepTracker
              tasks={tasks}
              dailyLog={currentDailyLog}
              selectedDate={selectedDate}
              onToggleTask={handleToggleTask}
              onUpdateDailyLog={handleUpdateDailyLog}
              earlySleepStreak={earlySleepStreak}
            />
          )}

          {activeTab === 'study_exercise' && (
            <StudyExerciseTracker
              studySessions={studySessions}
              exerciseLogs={exerciseLogs}
              selectedDate={selectedDate}
              onAddStudySession={handleAddStudySession}
              onToggleStudySession={handleToggleStudySession}
              onAddExerciseLog={handleAddExerciseLog}
              onToggleExerciseLog={handleToggleExerciseLog}
            />
          )}

          {activeTab === 'food_health' && (
            <FoodHealthTracker
              mealLogs={mealLogs}
              dailyLog={currentDailyLog}
              selectedDate={selectedDate}
              onAddMealLog={handleAddMealLog}
              onUpdateDailyLog={handleUpdateDailyLog}
            />
          )}

          {activeTab === 'goals' && (
            <GoalManager
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onToggleMilestone={handleToggleGoalMilestone}
              onDeleteGoal={handleDeleteGoal}
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
              tasks={tasks}
              dailyLogs={dailyLogs}
              studySessions={studySessions}
              exerciseLogs={exerciseLogs}
              goals={goals}
              purchases={purchases}
              selectedDate={selectedDate}
            />
          )}
        </main>
      </div>

      {/* Quick Add Universal Modal */}
      {isQuickAddOpen && (
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          selectedDate={selectedDate}
          onAddTask={handleAddTask}
          onAddStudySession={handleAddStudySession}
          onAddExerciseLog={handleAddExerciseLog}
          onAddMealLog={handleAddMealLog}
          onAddGoal={handleAddGoal}
          onAddPurchase={handleAddPurchase}
        />
      )}

      {/* Security & Login Dialog */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onSuccessLogin={handleSuccessLogin}
        userProfile={userProfile}
      />
    </div>
  );
}
