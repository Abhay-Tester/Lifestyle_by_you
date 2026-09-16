export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 
  | 'wake_routine' 
  | 'night_routine' 
  | 'study' 
  | 'exercise' 
  | 'health' 
  | 'work' 
  | 'general';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  scheduledTime?: string; // HH:mm
  completedDates: Record<string, boolean>; // key: YYYY-MM-DD, value: true/false
  recurring: 'daily' | 'weekdays' | 'weekends' | 'custom';
  notes?: string;
  createdAt: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  targetWakeTime: string; // HH:mm (default 06:00)
  actualWakeTime: string; // HH:mm
  targetSleepTime: string; // HH:mm (default 22:00)
  actualSleepTime: string; // HH:mm
  sleptEarly: boolean; // whether slept before or on 22:00
  sleepQuality: number; // 1 to 5
  mood: number; // 1 to 5
  energyLevel: number; // 1 to 5
  waterIntakeMl: number; // in milliliters (e.g. 3000)
  waterGoalMl: number; // default 3000
  digestionStatus: 'great' | 'normal' | 'bloated' | 'acidic' | 'sluggish' | 'okay';
  gutComfortRating: number; // 1 to 5
  digestionNotes?: string;
  notes?: string;
}

export interface StudySession {
  id: string;
  subject: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  type: 'deep_work' | 'reading' | 'practice' | 'revision' | 'lecture';
  notes?: string;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  workoutType: 'strength' | 'walking' | 'running' | 'yoga' | 'cycling' | 'stretching';
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'intense';
  date: string; // YYYY-MM-DD
  caloriesBurned?: number;
  notes?: string;
  completed: boolean;
}

export interface MealLog {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'hydration';
  date: string; // YYYY-MM-DD
  time: string;
  foodItems: string;
  digestionImpact: 'easy' | 'moderate' | 'heavy';
  fiberRich: boolean;
  notes?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: 'health' | 'career' | 'learning' | 'finance' | 'lifestyle' | 'mindset';
  targetDate: string;
  progress: number; // 0 to 100
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  milestones: GoalMilestone[];
  motivation?: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  estimatedCost: number;
  category: 'study' | 'health' | 'home' | 'tech' | 'fitness' | 'clothing' | 'other';
  status: 'saved_for' | 'planned' | 'purchased' | 'canceled';
  priority: Priority;
  targetDate?: string;
  notes?: string;
  productUrl?: string;
  createdAt: string;
}

export type LadderStage = '3_day' | '6_day' | '11_day' | '21_day';

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

export type EmergencyNoteCategory = 'client_request' | 'emergency_todo' | 'quick_thought' | 'meeting_note';

export interface EmergencyNote {
  id: string;
  title: string;
  content: string;
  clientName?: string;
  phoneNumber?: string;
  category: EmergencyNoteCategory;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
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
  | 'notes'
  | 'analytics'
  | 'profile';
