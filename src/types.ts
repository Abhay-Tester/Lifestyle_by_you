export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 
  | 'wake_routine' 
  | 'night_routine' 
  | 'study' 
  | 'exercise' 
  | 'health' 
  | 'general';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  scheduledTime?: string; // e.g. "06:30"
  completedDates: Record<string, boolean>; // key YYYY-MM-DD -> completed status
  recurring: 'daily' | 'weekdays' | 'weekends' | 'once';
  notes?: string;
  createdAt: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  targetWakeTime: string; // e.g. "06:00"
  actualWakeTime?: string; // e.g. "06:15"
  targetSleepTime: string; // e.g. "22:00"
  actualSleepTime?: string; // e.g. "21:45"
  sleptEarly: boolean;
  sleepQuality: number; // 1 - 5
  mood: number; // 1 - 5
  energyLevel: number; // 1 - 5
  waterIntakeMl: number; // e.g., 2500
  waterGoalMl: number; // e.g., 3000
  digestionStatus: 'great' | 'normal' | 'bloated' | 'sluggish' | 'acidic' | 'sensitive';
  digestionNotes?: string;
  gutComfortRating: number; // 1 - 5
  notes?: string;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  durationMinutes: number;
  type: 'reading' | 'practice' | 'deep_work' | 'revision' | 'lecture';
  notes?: string;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  date: string; // YYYY-MM-DD
  workoutType: 'cardio' | 'strength' | 'yoga' | 'walking' | 'sports' | 'stretching' | 'hiit';
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'intense';
  caloriesBurned?: number;
  notes?: string;
  completed: boolean;
}

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:30"
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: string;
  digestionImpact: 'easy' | 'neutral' | 'heavy' | 'irritating';
  fiberRich: boolean;
  notes?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'health' | 'career' | 'learning' | 'finance' | 'lifestyle' | 'mindset';
  targetDate: string;
  progress: number; // 0 - 100
  status: 'not_started' | 'in_progress' | 'completed';
  milestones: GoalMilestone[];
  motivation: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  category: 'tech' | 'health' | 'home' | 'study' | 'fitness' | 'clothing' | 'other';
  priority: 'must_have' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  targetDate?: string;
  status: 'planned' | 'saved_for' | 'purchased' | 'canceled';
  url?: string;
  notes?: string;
  createdAt: string;
}

export type LadderStage = '3_day' | '6_day' | '11_day' | '21_day' | 'progressive';

export interface HabitChallenge {
  id: string;
  title: string;
  category: 'wake_up' | 'study' | 'exercise' | 'health' | 'general';
  targetDays: number; // 3 -> 6 -> 11 -> 21...
  completedDates: string[]; // array of YYYY-MM-DD
  currentStage: LadderStage;
  startDate: string;
  notes?: string;
  brainComfortTip?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  lastLoginAt?: string;
}

export type ActiveTab = 
  | 'habit_matrix'
  | 'habit_ladder'
  | 'wake_sleep' 
  | 'study_exercise' 
  | 'food_health' 
  | 'goals' 
  | 'purchases' 
  | 'analytics'
  | 'profile';
