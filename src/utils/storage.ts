import { Task, DailyLog, StudySession, ExerciseLog, MealLog, Goal, PurchaseItem, HabitChallenge, UserProfile, EmergencyNote } from '../types';
import { getTodayDateString, shiftDate } from './date';

const STORAGE_KEYS = {
  TASKS: 'lifeos_tasks_v1',
  DAILY_LOGS: 'lifeos_daily_logs_v1',
  STUDY_SESSIONS: 'lifeos_study_sessions_v1',
  EXERCISE_LOGS: 'lifeos_exercise_logs_v1',
  MEAL_LOGS: 'lifeos_meal_logs_v1',
  GOALS: 'lifeos_goals_v1',
  PURCHASES: 'lifeos_purchases_v1',
  HABIT_CHALLENGES: 'lifeos_habit_challenges_v1',
  USER_PROFILE: 'lifeos_user_profile_v1',
  AUTH_SESSION: 'lifeos_auth_session_v1',
  EMERGENCY_NOTES: 'lifeos_emergency_notes_v1',
};

/**
 * Creates an empty baseline profile for any user
 */
export function createDefaultUserProfile(name = 'My Profile', email = ''): UserProfile {
  return {
    name,
    phone: '',
    whatsappNumber: '',
    email,
    bio: 'Building consistent daily habits, focused studying, healthy digestion, and achieving high-priority life goals.',
    city: '',
  };
}

export const defaultUserProfile: UserProfile = createDefaultUserProfile('Abhay Toriya', 'abhaytoriya23@gmail.com');

const today = getTodayDateString();
const yesterday = shiftDate(today, -1);
const twoDaysAgo = shiftDate(today, -2);

export const defaultTasks: Task[] = [
  {
    id: 't-1',
    title: 'Sunrise Wake-up (6:00 AM) & Drink 500ml Water',
    category: 'wake_routine',
    priority: 'high',
    scheduledTime: '06:00',
    completedDates: { [today]: true, [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Immediate hydration before looking at phone.',
    createdAt: today,
  },
  {
    id: 't-2',
    title: '15 Min Morning Sunlight & Breathwork',
    category: 'wake_routine',
    priority: 'high',
    scheduledTime: '06:20',
    completedDates: { [today]: true, [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Reset circadian rhythm and activate cortisol gently.',
    createdAt: today,
  },
  {
    id: 't-3',
    title: 'Deep Work Focus Block 1 (90 Mins)',
    category: 'study',
    priority: 'high',
    scheduledTime: '08:00',
    completedDates: { [today]: true, [yesterday]: true },
    recurring: 'daily',
    notes: 'Phone in airplane mode. Highest cognitive task only.',
    createdAt: today,
  },
  {
    id: 't-4',
    title: 'Post-Lunch 15 Min Digestion Stroll',
    category: 'health',
    priority: 'medium',
    scheduledTime: '13:30',
    completedDates: { [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Aids glucose clearing and keeps stomach relaxed.',
    createdAt: today,
  },
  {
    id: 't-5',
    title: 'Evening Workout / Strength Training',
    category: 'exercise',
    priority: 'high',
    scheduledTime: '17:30',
    completedDates: { [yesterday]: true },
    recurring: 'daily',
    notes: 'Push / Pull split or brisk 5km run.',
    createdAt: today,
  },
  {
    id: 't-6',
    title: 'Night Digital Wind-down & Screen Off',
    category: 'night_routine',
    priority: 'high',
    scheduledTime: '21:30',
    completedDates: { [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Warm dim lighting, book reading, zero blue light.',
    createdAt: today,
  },
  {
    id: 't-7',
    title: 'Target Sleep by 10:00 PM',
    category: 'night_routine',
    priority: 'high',
    scheduledTime: '22:00',
    completedDates: { [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Consistent bedtime locks sleep cycle and deep recovery.',
    createdAt: today,
  },
];

export const defaultDailyLogs: Record<string, DailyLog> = {
  [today]: {
    date: today,
    targetWakeTime: '06:00',
    actualWakeTime: '06:10',
    targetSleepTime: '22:00',
    actualSleepTime: '',
    sleptEarly: true,
    sleepQuality: 5,
    mood: 5,
    energyLevel: 4,
    waterIntakeMl: 1750,
    waterGoalMl: 3000,
    digestionStatus: 'great',
    gutComfortRating: 5,
    digestionNotes: 'Felt light after morning warm water and sprouted salad.',
    notes: 'Strong morning routine. Energy stayed consistent through deep work.',
  },
  [yesterday]: {
    date: yesterday,
    targetWakeTime: '06:00',
    actualWakeTime: '06:15',
    targetSleepTime: '22:00',
    actualSleepTime: '21:50',
    sleptEarly: true,
    sleepQuality: 4,
    mood: 4,
    energyLevel: 4,
    waterIntakeMl: 3000,
    waterGoalMl: 3000,
    digestionStatus: 'normal',
    gutComfortRating: 4,
    digestionNotes: 'Digestion steady with timed lunch.',
    notes: 'Hit bed by 9:50 PM. Woke up refreshed.',
  },
  [twoDaysAgo]: {
    date: twoDaysAgo,
    targetWakeTime: '06:00',
    actualWakeTime: '06:00',
    targetSleepTime: '22:00',
    actualSleepTime: '21:45',
    sleptEarly: true,
    sleepQuality: 5,
    mood: 5,
    energyLevel: 5,
    waterIntakeMl: 3000,
    waterGoalMl: 3000,
    digestionStatus: 'great',
    gutComfortRating: 5,
    digestionNotes: 'High energy, comfortable gut.',
    notes: 'Slept 8 full hours. Woke up energized.',
  }
};

export const defaultStudySessions: StudySession[] = [
  {
    id: 's-1',
    subject: 'DSA & Advanced Algorithms Problem Solving',
    durationMinutes: 90,
    date: today,
    type: 'deep_work',
    notes: 'Solved 2 Dynamic Programming questions with full focus.',
    completed: true,
  },
  {
    id: 's-2',
    subject: 'System Architecture & Scalability Reading',
    durationMinutes: 60,
    date: yesterday,
    type: 'reading',
    notes: 'Reviewed message queues and distributed caching patterns.',
    completed: true,
  }
];

export const defaultExerciseLogs: ExerciseLog[] = [
  {
    id: 'e-1',
    workoutType: 'strength',
    durationMinutes: 45,
    intensity: 'intense',
    date: yesterday,
    caloriesBurned: 340,
    notes: 'Chest and triceps with progressive overload.',
    completed: true,
  },
  {
    id: 'e-2',
    workoutType: 'walking',
    durationMinutes: 30,
    intensity: 'light',
    date: today,
    caloriesBurned: 160,
    notes: 'Morning fresh air and mobility stretches.',
    completed: true,
  }
];

export const defaultMealLogs: MealLog[] = [
  {
    id: 'm-1',
    mealType: 'breakfast',
    date: today,
    time: '08:30',
    foodItems: 'Sprouted Moong Salad & Warm Cumin Infusion',
    digestionImpact: 'easy',
    fiberRich: true,
    notes: 'Zero heaviness, sustained morning focus.',
  },
  {
    id: 'm-2',
    mealType: 'lunch',
    date: today,
    time: '13:00',
    foodItems: 'Wholesome Khichdi with Ghee & Curd',
    digestionImpact: 'easy',
    fiberRich: true,
    notes: 'Easy digestion, avoided overeating.',
  }
];

export const defaultGoals: Goal[] = [
  {
    id: 'g-1',
    title: '30-Day Early Sleep Mastery (Before 10 PM)',
    category: 'lifestyle',
    targetDate: shiftDate(today, 25),
    progress: 70,
    status: 'in_progress',
    milestones: [
      { id: 'm-1', title: 'Lock 9:30 PM screen cutoff habit', completed: true },
      { id: 'm-2', title: '7-day continuous streak', completed: true },
      { id: 'm-3', title: 'Complete 30 consecutive days', completed: false },
    ],
    motivation: 'Consistency in bedtime anchors the entire day.',
    createdAt: today,
  },
  {
    id: 'g-2',
    title: 'Master 100 Deep Work Coding Hours',
    category: 'career',
    targetDate: shiftDate(today, 45),
    progress: 45,
    status: 'in_progress',
    milestones: [
      { id: 'm-4', title: 'Complete 25 hours deep focus', completed: true },
      { id: 'm-5', title: 'Reach 50 hours deep focus', completed: false },
      { id: 'm-6', title: 'Hit 100 milestone target', completed: false },
    ],
    motivation: 'Quality focus with zero task switching.',
    createdAt: today,
  }
];

export const defaultPurchases: PurchaseItem[] = [
  {
    id: 'p-1',
    name: 'Ergonomic Lumbar Support Cushion',
    estimatedCost: 1499,
    category: 'health',
    status: 'planned',
    priority: 'high',
    notes: 'Maintains spinal alignment during long study blocks.',
    createdAt: today,
  },
  {
    id: 'p-2',
    name: 'High-Density 32oz Insulated Water Flask',
    estimatedCost: 899,
    category: 'fitness',
    status: 'planned',
    priority: 'high',
    notes: 'Keeps water chilled and visible on desk to hit 3L goal.',
    createdAt: today,
  }
];

export const defaultHabitChallenges: HabitChallenge[] = [
  {
    id: 'hc-1',
    title: 'Early Bedtime (In Bed by 10:00 PM)',
    category: 'wake_up',
    targetDays: 6,
    completedDates: [twoDaysAgo, yesterday],
    currentStage: '6_day',
    startDate: twoDaysAgo,
    notes: 'Brain comfort ladder: Start with 3 days, graduate to 6, then lock 11 days.',
    brainComfortTip: 'Tell your brain: "I only need to do this tonight." Small promises build unbreakable momentum.',
  },
  {
    id: 'hc-2',
    title: 'Daily 3000ml Hydration & Clean Gut Fuel',
    category: 'health',
    targetDays: 3,
    completedDates: [twoDaysAgo, yesterday],
    currentStage: '3_day',
    startDate: twoDaysAgo,
    notes: 'Continuous cellular hydration + gut-friendly fiber for digestion comfort.',
    brainComfortTip: 'Hydrate every hour to maintain maximum alertness and metabolic ease.',
  }
];

export const defaultEmergencyNotes: EmergencyNote[] = [
  {
    id: 'n-1',
    title: 'Daily Reflection & Priority Focus',
    content: 'Completed morning routine and 3L water intake. Key focus for today is deep work on project architecture without checking phone notifications.',
    date: today,
    time: '09:30',
    priority: 'high',
    isCompleted: false,
    createdAt: today,
  },
  {
    id: 'n-2',
    title: 'Cognitive Momentum & Habit Cues',
    content: 'Insight from reading: small consistent actions reduce psychological resistance. Lower friction on the starting step.',
    date: today,
    time: '14:45',
    priority: 'medium',
    isCompleted: false,
    createdAt: today,
  }
];

/**
 * Returns a user-scoped storage key
 */
export function getUserStorageKey(baseKey: string, userId?: string): string {
  if (!userId) return baseKey;
  return `${baseKey}_${userId}`;
}

export function loadStoredData<T>(key: string, fallback: T, userId?: string): T {
  try {
    const finalKey = getUserStorageKey(key, userId);
    const raw = localStorage.getItem(finalKey);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
    return fallback;
  }
}

export function saveStoredData<T>(key: string, value: T, userId?: string): void {
  try {
    const finalKey = getUserStorageKey(key, userId);
    localStorage.setItem(finalKey, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving storage key ${key}:`, err);
  }
}

export function exportAllUserData(userId?: string): string {
  const data = {
    tasks: loadStoredData(STORAGE_KEYS.TASKS, defaultTasks, userId),
    dailyLogs: loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs, userId),
    studySessions: loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions, userId),
    exerciseLogs: loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs, userId),
    mealLogs: loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs, userId),
    goals: loadStoredData(STORAGE_KEYS.GOALS, defaultGoals, userId),
    purchases: loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases, userId),
    habitChallenges: loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges, userId),
    emergencyNotes: loadStoredData(STORAGE_KEYS.EMERGENCY_NOTES, defaultEmergencyNotes, userId),
    profile: loadStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile, userId),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importUserData(jsonString: string, userId?: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveStoredData(STORAGE_KEYS.TASKS, data.tasks, userId);
    if (data.dailyLogs) saveStoredData(STORAGE_KEYS.DAILY_LOGS, data.dailyLogs, userId);
    if (data.studySessions) saveStoredData(STORAGE_KEYS.STUDY_SESSIONS, data.studySessions, userId);
    if (data.exerciseLogs) saveStoredData(STORAGE_KEYS.EXERCISE_LOGS, data.exerciseLogs, userId);
    if (data.mealLogs) saveStoredData(STORAGE_KEYS.MEAL_LOGS, data.mealLogs, userId);
    if (data.goals) saveStoredData(STORAGE_KEYS.GOALS, data.goals, userId);
    if (data.purchases) saveStoredData(STORAGE_KEYS.PURCHASES, data.purchases, userId);
    if (data.habitChallenges) saveStoredData(STORAGE_KEYS.HABIT_CHALLENGES, data.habitChallenges, userId);
    if (data.emergencyNotes) saveStoredData(STORAGE_KEYS.EMERGENCY_NOTES, data.emergencyNotes, userId);
    if (data.profile) saveStoredData(STORAGE_KEYS.USER_PROFILE, data.profile, userId);
    return true;
  } catch (err) {
    console.error('Failed to import user data:', err);
    return false;
  }
}

export function resetAllDataToDefault(userId?: string): void {
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.TASKS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.DAILY_LOGS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.STUDY_SESSIONS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.EXERCISE_LOGS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.MEAL_LOGS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.GOALS, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.PURCHASES, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.HABIT_CHALLENGES, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.EMERGENCY_NOTES, userId));
  localStorage.removeItem(getUserStorageKey(STORAGE_KEYS.USER_PROFILE, userId));
}

export { STORAGE_KEYS };
