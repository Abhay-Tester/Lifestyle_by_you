import React from 'react';
import { Task, DailyLog, StudySession, ExerciseLog, Goal, PurchaseItem } from '../types';
import { getLastNDays, formatDateFriendly, getTodayDateString } from '../utils/date';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  BookOpen, 
  Dumbbell, 
  Droplets, 
  HeartPulse, 
  Target, 
  ShoppingBag,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

interface AnalyticsOverviewProps {
  tasks: Task[];
  dailyLogs: Record<string, DailyLog>;
  studySessions: StudySession[];
  exerciseLogs: ExerciseLog[];
  goals: Goal[];
  purchases: PurchaseItem[];
  earlySleepStreak: number;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  tasks,
  dailyLogs,
  studySessions,
  exerciseLogs,
  goals,
  purchases,
  earlySleepStreak,
}) => {
  const last7Days = getLastNDays(7);

  // Calculate completion percentage for each of the last 7 days
  const dailyTaskStats = last7Days.map((dateStr) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completedDates[dateStr]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Study mins for date
    const studyMins = studySessions
      .filter((s) => s.date === dateStr && s.completed)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Exercise mins for date
    const exerciseMins = exerciseLogs
      .filter((e) => e.date === dateStr && e.completed)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    const log = dailyLogs[dateStr];
    const sleptEarly = log ? log.sleptEarly : false;

    return {
      date: dateStr,
      label: formatDateFriendly(dateStr),
      percentage,
      completed,
      total,
      studyMins,
      exerciseMins,
      sleptEarly,
    };
  });

  const overallAvgCompletion = Math.round(
    dailyTaskStats.reduce((acc, curr) => acc + curr.percentage, 0) / 7
  );

  const totalWeeklyStudyMins = dailyTaskStats.reduce((acc, curr) => acc + curr.studyMins, 0);
  const totalWeeklyExerciseMins = dailyTaskStats.reduce((acc, curr) => acc + curr.exerciseMins, 0);

  return (
    <div className="space-y-6">

      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Analytics & Streaks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Weekly task execution rates, sleep consistency, study time, and workout stats.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0 text-xs">
          <div>
            <span className="text-slate-500 block">Weekly Avg</span>
            <strong className="text-emerald-600 font-mono text-sm">{overallAvgCompletion}%</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Sleep Streak</span>
            <strong className="text-amber-600 font-mono text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {earlySleepStreak} Days
            </strong>
          </div>
        </div>
      </div>

      {/* Visual Chart: 7-Day Completion Bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          7-Day Task Completion Rate (%)
        </h3>

        <div className="grid grid-cols-7 gap-3 pt-4 items-end h-48 border-b border-slate-100 pb-3">
          {dailyTaskStats.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-mono font-bold text-emerald-600">{day.percentage}%</span>
              <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-32 flex items-end border border-slate-200">
                <div 
                  className={`w-full transition-all duration-500 rounded-t-xl ${
                    day.percentage >= 80 ? 'bg-gradient-to-t from-emerald-600 to-emerald-500' :
                    day.percentage >= 50 ? 'bg-gradient-to-t from-indigo-600 to-indigo-500' :
                    'bg-gradient-to-t from-amber-500 to-amber-400'
                  }`}
                  style={{ height: `${day.percentage}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-slate-600 text-center truncate w-full">
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Study vs Exercise & Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Study vs Exercise Weekly Hours */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Study vs Workout Balance (Last 7 Days)
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-600 font-medium">Total Study Time</span>
              <div className="text-2xl font-mono font-bold text-indigo-600">
                {(totalWeeklyStudyMins / 60).toFixed(1)} hrs
              </div>
              <span className="text-[11px] text-slate-500">{totalWeeklyStudyMins} total minutes</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-600 font-medium">Total Exercise Time</span>
              <div className="text-2xl font-mono font-bold text-emerald-600">
                {(totalWeeklyExerciseMins / 60).toFixed(1)} hrs
              </div>
              <span className="text-[11px] text-slate-500">{totalWeeklyExerciseMins} total minutes</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-700">Daily Breakdown</div>
            {dailyTaskStats.map((day) => (
              <div key={day.date} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-800 font-medium">{day.label}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-indigo-600 font-semibold">{day.studyMins}m study</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600 font-semibold">{day.exerciseMins}m workout</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Purchases Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Life Systems Distribution
          </h3>

          <div className="space-y-4 text-xs">
            {/* Goals summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>Active Life Goals</span>
                <span className="text-indigo-600 font-mono font-bold">{goals.length} Goals</span>
              </div>
              <div className="text-slate-600">
                Avg Goal Completion Rate: {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / (goals.length || 1))}%
              </div>
            </div>

            {/* Purchases summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>Future Purchase List</span>
                <span className="text-indigo-600 font-mono font-bold">{purchases.length} Items</span>
              </div>
              <div className="text-slate-600 flex flex-wrap items-center justify-between gap-1 text-[11px] font-medium">
                <span>Purchased: {purchases.filter(p => p.status === 'purchased').length} (₹{purchases.filter(p => p.status === 'purchased').reduce((s, p) => s + p.estimatedCost, 0).toLocaleString('en-IN')})</span>
                <span className="text-slate-300">•</span>
                <span>Planned: {purchases.filter(p => p.status === 'planned').length} (₹{purchases.filter(p => p.status === 'planned').reduce((s, p) => s + p.estimatedCost, 0).toLocaleString('en-IN')})</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> System Health Status
              </div>
              <p className="text-slate-700 leading-relaxed">
                Your all-in-one LifeOS software is maintaining healthy daily tracking. Keeping your early sleeper habit (bedtime by 10:00 PM) delivers compound gains across focus, study stamina, and metabolic digestion.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
