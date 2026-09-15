import { Task, DailyLog, StudySession, ExerciseLog, MealLog, Goal, PurchaseItem, HabitChallenge, UserProfile } from '../types';
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
};

export const defaultUserProfile: UserProfile = {
  name: 'Abhay Toriya',
  phone: '7385302325',
  whatsappNumber: '7385302325',
  email: 'abhaytoriya23@gmail.com',
  password: 'Abhay@123',
  bio: 'Building consistent daily habits, focused studying, healthy digestion, and achieving high-priority life goals.',
  city: 'Maharashtra, India',
};

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
    completedDates: { [today]: true, [yesterday]: true },
    recurring: 'daily',
    notes: 'Sets circadian clock for early sleep tonight.',
    createdAt: today,
  },
  {
    id: 't-3',
    title: 'Focused Study Block: Core Science / Tech (90 mins)',
    category: 'study',
    priority: 'high',
    scheduledTime: '08:00',
    completedDates: { [today]: false, [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'weekdays',
    notes: 'Pomodoro deep focus without social media.',
    createdAt: today,
  },
  {
    id: 't-4',
    title: 'Workout / Cardio (45 Mins)',
    category: 'exercise',
    priority: 'high',
    scheduledTime: '17:30',
    completedDates: { [today]: false, [yesterday]: true },
    recurring: 'daily',
    notes: 'Strengthen cardiovascular health & mental energy.',
    createdAt: today,
  },
  {
    id: 't-5',
    title: 'Probiotic & Digestive Health Fiber Snack',
    category: 'health',
    priority: 'medium',
    scheduledTime: '16:00',
    completedDates: { [today]: true, [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Yogurt / Papaya / Chia seeds for optimal gut digestion.',
    createdAt: today,
  },
  {
    id: 't-6',
    title: 'Digital Wind-Down & Blue Light Filter (9:15 PM)',
    category: 'night_routine',
    priority: 'high',
    scheduledTime: '21:15',
    completedDates: { [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Screen off or reading physical book.',
    createdAt: today,
  },
  {
    id: 't-7',
    title: 'Early Sleep Bedtime Target (10:00 PM)',
    category: 'night_routine',
    priority: 'high',
    scheduledTime: '22:00',
    completedDates: { [yesterday]: true, [twoDaysAgo]: true },
    recurring: 'daily',
    notes: 'Consistent bedtime builds immune system and high energy.',
    createdAt: today,
  }
];

export const defaultDailyLogs: Record<string, DailyLog> = {
  [today]: {
    date: today,
    targetWakeTime: '06:00',
    actualWakeTime: '06:05',
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
    digestionNotes: 'Felt light after papaya and warm herbal tea. No bloating today.',
    notes: 'Woke up naturally feeling refreshed. Early sleep routine is working great!',
  },
  [yesterday]: {
    date: yesterday,
    targetWakeTime: '06:00',
    actualWakeTime: '06:10',
    targetSleepTime: '22:00',
    actualSleepTime: '21:50',
    sleptEarly: true,
    sleepQuality: 4,
    mood: 4,
    energyLevel: 4,
    waterIntakeMl: 2750,
    waterGoalMl: 3000,
    digestionStatus: 'normal',
    gutComfortRating: 4,
    digestionNotes: 'Had balanced fiber rich lunch. Digestion smooth.',
    notes: 'In bed before 10 PM. Solid focus during morning study.',
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
    date: today,
    subject: 'System Architecture & Data Structures',
    durationMinutes: 90,
    type: 'deep_work',
    notes: 'Focused on graph algorithms and system design patterns.',
    completed: true,
  },
  {
    id: 's-2',
    date: today,
    subject: 'AI & Machine Learning Research',
    durationMinutes: 60,
    type: 'reading',
    notes: 'Read paper on transformer optimizations and prompt engineering.',
    completed: false,
  },
  {
    id: 's-3',
    date: yesterday,
    subject: 'Fullstack Web Development & Database Indexing',
    durationMinutes: 120,
    type: 'practice',
    notes: 'Implemented RESTful API routes and query performance tuning.',
    completed: true,
  }
];

export const defaultExerciseLogs: ExerciseLog[] = [
  {
    id: 'e-1',
    date: today,
    workoutType: 'strength',
    durationMinutes: 45,
    intensity: 'intense',
    caloriesBurned: 350,
    notes: 'Upper body resistance + core stability training.',
    completed: false,
  },
  {
    id: 'e-2',
    date: yesterday,
    workoutType: 'cardio',
    durationMinutes: 30,
    intensity: 'moderate',
    caloriesBurned: 280,
    notes: 'Outdoor brisk interval run at 6:30 PM.',
    completed: true,
  },
  {
    id: 'e-3',
    date: twoDaysAgo,
    workoutType: 'yoga',
    durationMinutes: 30,
    intensity: 'light',
    caloriesBurned: 120,
    notes: 'Evening mobility, hip openers, and spine decompression.',
    completed: true,
  }
];

export const defaultMealLogs: MealLog[] = [
  {
    id: 'm-1',
    date: today,
    time: '08:15',
    mealType: 'breakfast',
    foodItems: 'Oatmeal with chia seeds, banana, blueberries, and almond butter',
    digestionImpact: 'easy',
    fiberRich: true,
    notes: 'Very soothing for gut health and long-sustained energy.',
  },
  {
    id: 'm-2',
    date: today,
    time: '13:00',
    mealType: 'lunch',
    foodItems: 'Steamed brown rice, grilled chicken breast, spinach, and avocado salad',
    digestionImpact: 'easy',
    fiberRich: true,
    notes: 'Felt light and energetic post-lunch.',
  },
  {
    id: 'm-3',
    date: yesterday,
    time: '19:30',
    mealType: 'dinner',
    foodItems: 'Lentil vegetable soup with sourdough bread & steamed broccoli',
    digestionImpact: 'easy',
    fiberRich: true,
    notes: 'Eaten 2.5 hours before sleep for effortless digestion.',
  }
];

export const defaultGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Achieve 30-Day Early Sleeper & 6:00 AM Wake Streak',
    category: 'health',
    targetDate: '2026-08-31',
    progress: 75,
    status: 'in_progress',
    motivation: 'Wake up fresh without fatigue, maximize daily focus and cognitive vitality.',
    milestones: [
      { id: 'm-1-1', title: 'Maintain 7 consecutive nights bedtime before 10 PM', completed: true },
      { id: 'm-1-2', title: 'Maintain 14 consecutive nights bedtime before 10 PM', completed: true },
      { id: 'm-1-3', title: 'Complete 30 days without late-night screens', completed: false }
    ],
    createdAt: today
  },
  {
    id: 'g-2',
    title: 'Master Advanced Fullstack & AI Engineering Curriculum',
    category: 'career',
    targetDate: '2026-09-15',
    progress: 60,
    status: 'in_progress',
    motivation: 'Build high-performance distributed systems and AI applications.',
    milestones: [
      { id: 'm-2-1', title: 'Complete 50 hours of deep work study sessions', completed: true },
      { id: 'm-2-2', title: 'Publish 3 open-source system tools', completed: true },
      { id: 'm-2-3', title: 'Deploy full scale Cloud architecture app', completed: false }
    ],
    createdAt: today
  },
  {
    id: 'g-3',
    title: 'Optimal Gut & Digestive Health System',
    category: 'health',
    targetDate: '2026-08-15',
    progress: 80,
    status: 'in_progress',
    motivation: 'Maintain 30g+ daily dietary fiber, 3L water, and 0 digestive discomfort.',
    milestones: [
      { id: 'm-3-1', title: 'Drink 3L water daily for 14 straight days', completed: true },
      { id: 'm-3-2', title: 'Log meal digestion notes daily for 3 weeks', completed: true },
      { id: 'm-3-3', title: 'Eliminate ultra-processed late night snacking', completed: true }
    ],
    createdAt: today
  }
];

export const defaultPurchases: PurchaseItem[] = [
  {
    id: 'p-1',
    name: 'Ergonomic Mesh Chair with Lumbar Support',
    category: 'home',
    priority: 'must_have',
    estimatedCost: 280,
    targetDate: '2026-08-10',
    status: 'saved_for',
    url: 'https://example.com/ergonomic-chair',
    notes: 'Crucial for posture during study and long work sessions.',
    createdAt: today
  },
  {
    id: 'p-2',
    name: 'Blue Light Blocking Glasses & Sleep Mask Set',
    category: 'health',
    priority: 'high',
    estimatedCost: 35,
    targetDate: '2026-08-01',
    status: 'planned',
    notes: 'Helps melatonin secretion for early sleep routine.',
    createdAt: today
  },
  {
    id: 'p-3',
    name: 'Cold Press Slow Juicer for Gut Health Drinks',
    category: 'health',
    priority: 'medium',
    estimatedCost: 120,
    targetDate: '2026-08-20',
    status: 'planned',
    notes: 'For fresh celery, ginger, and beet juices to boost digestion.',
    createdAt: today
  },
  {
    id: 'p-4',
    name: 'Noise-Canceling Wireless Headphones',
    category: 'tech',
    priority: 'high',
    estimatedCost: 199,
    targetDate: '2026-09-01',
    status: 'purchased',
    notes: 'Zero-distraction deep work study blocks.',
    createdAt: today
  }
];

export const defaultHabitChallenges: HabitChallenge[] = [
  {
    id: 'hc-1',
    title: 'Sunrise Wake-Up (6:00 AM)',
    category: 'wake_up',
    targetDays: 3,
    completedDates: [twoDaysAgo, yesterday],
    currentStage: '3_day',
    startDate: twoDaysAgo,
    notes: 'Hydrate immediately upon waking. Catch 15 min morning sunlight.',
    brainComfortTip: 'Step 1: Focus purely on 3 days. Your brain experiences zero overwhelm when the goal is just 3 days.',
  },
  {
    id: 'hc-2',
    title: 'Focused Deep Work Study (90 Mins)',
    category: 'study',
    targetDays: 3,
    completedDates: [twoDaysAgo, yesterday],
    currentStage: '3_day',
    startDate: twoDaysAgo,
    notes: 'Pomodoro focus blocks for core science, coding & revision.',
    brainComfortTip: 'Breaking daunting study goals into 3-day micro horizons removes cognitive friction.',
  },
  {
    id: 'hc-3',
    title: 'Daily Exercise & Body Movement (45 Mins)',
    category: 'exercise',
    targetDays: 3,
    completedDates: [yesterday],
    currentStage: '3_day',
    startDate: yesterday,
    notes: 'Strength training or cardio. Releases brain endorphins & reduces stress.',
    brainComfortTip: 'Physical movement triggers BDNF (brain-derived neurotrophic factor), accelerating habit formation.',
  },
  {
    id: 'hc-4',
    title: 'Hydration (3L Water) & Probiotic Fiber Meal',
    category: 'health',
    targetDays: 3,
    completedDates: [twoDaysAgo, yesterday],
    currentStage: '3_day',
    startDate: twoDaysAgo,
    notes: 'Continuous cellular hydration + gut-friendly fiber for digestion comfort.',
    brainComfortTip: 'Hydrate every hour to maintain maximum alertness and metabolic ease.',
  }
];

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading storage key ${key}:`, err);
    return fallback;
  }
}

export function saveStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving storage key ${key}:`, err);
  }
}

export function exportAllUserData(): string {
  const data = {
    tasks: loadStoredData(STORAGE_KEYS.TASKS, defaultTasks),
    dailyLogs: loadStoredData(STORAGE_KEYS.DAILY_LOGS, defaultDailyLogs),
    studySessions: loadStoredData(STORAGE_KEYS.STUDY_SESSIONS, defaultStudySessions),
    exerciseLogs: loadStoredData(STORAGE_KEYS.EXERCISE_LOGS, defaultExerciseLogs),
    mealLogs: loadStoredData(STORAGE_KEYS.MEAL_LOGS, defaultMealLogs),
    goals: loadStoredData(STORAGE_KEYS.GOALS, defaultGoals),
    purchases: loadStoredData(STORAGE_KEYS.PURCHASES, defaultPurchases),
    habitChallenges: loadStoredData(STORAGE_KEYS.HABIT_CHALLENGES, defaultHabitChallenges),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importUserData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveStoredData(STORAGE_KEYS.TASKS, data.tasks);
    if (data.dailyLogs) saveStoredData(STORAGE_KEYS.DAILY_LOGS, data.dailyLogs);
    if (data.studySessions) saveStoredData(STORAGE_KEYS.STUDY_SESSIONS, data.studySessions);
    if (data.exerciseLogs) saveStoredData(STORAGE_KEYS.EXERCISE_LOGS, data.exerciseLogs);
    if (data.mealLogs) saveStoredData(STORAGE_KEYS.MEAL_LOGS, data.mealLogs);
    if (data.goals) saveStoredData(STORAGE_KEYS.GOALS, data.goals);
    if (data.purchases) saveStoredData(STORAGE_KEYS.PURCHASES, data.purchases);
    if (data.habitChallenges) saveStoredData(STORAGE_KEYS.HABIT_CHALLENGES, data.habitChallenges);
    return true;
  } catch (err) {
    console.error('Failed to import user data:', err);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
  localStorage.removeItem(STORAGE_KEYS.STUDY_SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.EXERCISE_LOGS);
  localStorage.removeItem(STORAGE_KEYS.MEAL_LOGS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.PURCHASES);
  localStorage.removeItem(STORAGE_KEYS.HABIT_CHALLENGES);
}

export { STORAGE_KEYS };
