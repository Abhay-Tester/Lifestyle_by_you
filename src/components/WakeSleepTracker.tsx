import React from 'react';
import { Task, DailyLog } from '../types';
import { formatDateFriendly, getTodayDateString, shiftDate } from '../utils/date';
import { 
  Sun, 
  Moon, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface WakeSleepTrackerProps {
  selectedDate: string;
  dailyLog: DailyLog;
  tasks: Task[];
  earlySleepStreak: number;
  onUpdateDailyLog: (date: string, partial: Partial<DailyLog>) => void;
  onToggleTask: (taskId: string, date: string) => void;
}

export const WakeSleepTracker: React.FC<WakeSleepTrackerProps> = ({
  selectedDate,
  dailyLog,
  tasks,
  earlySleepStreak,
  onUpdateDailyLog,
  onToggleTask,
}) => {
  const wakeTasks = tasks.filter(t => t.category === 'wake_routine');
  const sleepTasks = tasks.filter(t => t.category === 'night_routine');

  // Compute sleep efficiency score
  const targetWake = dailyLog.targetWakeTime || '06:00';
  const actualWake = dailyLog.actualWakeTime || '06:00';
  const targetSleep = dailyLog.targetSleepTime || '22:00';
  const actualSleep = dailyLog.actualSleepTime || '22:00';

  const sleepQuality = dailyLog.sleepQuality || 4;
  const sleptEarly = dailyLog.sleptEarly;

  return (
    <div className="space-y-6">

      {/* Simple Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            Wake & Sleep Routine
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {earlySleepStreak} Day Streak
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Log your actual sleep and wakeup times to build a healthy circadian rhythm.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0 text-xs">
          <div>
            <span className="text-slate-500 block">Bedtime</span>
            <strong className="text-indigo-600 font-mono text-sm">10:00 PM</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Wake Up</span>
            <strong className="text-amber-600 font-mono text-sm">06:00 AM</strong>
          </div>
        </div>
      </div>

      {/* Wake & Sleep Daily Log Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Morning Wake Log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
            <h3 className="font-bold text-slate-900 text-base">Morning Wake-Up Tracker</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Target Wake Time</label>
              <input
                type="time"
                value={dailyLog.targetWakeTime || '06:00'}
                onChange={(e) => onUpdateDailyLog(selectedDate, { targetWakeTime: e.target.value })}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Actual Wake Time</label>
              <input
                type="time"
                value={dailyLog.actualWakeTime || ''}
                onChange={(e) => onUpdateDailyLog(selectedDate, { actualWakeTime: e.target.value })}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Morning Routine Checklist */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Morning Activation Checklist</h4>
            {wakeTasks.map((task) => {
              const todayStr = getTodayDateString();
              const taskCreatedDate = (task.createdAt || selectedDate).split('T')[0];
              const isBeforeCreated = selectedDate < taskCreatedDate;
              const isFuture = selectedDate > todayStr;
              const isDisabled = isBeforeCreated || isFuture;
              const isDone = !isDisabled && !!task.completedDates[selectedDate];
              return (
                <div
                  key={task.id}
                  onClick={() => !isDisabled && onToggleTask(task.id, selectedDate)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isDisabled
                      ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : isDone
                      ? 'bg-amber-50/50 border-amber-200 text-slate-400 line-through cursor-pointer'
                      : 'bg-slate-50 border-slate-100 text-slate-900 cursor-pointer hover:border-slate-200'
                  }`}
                  title={
                    isBeforeCreated
                      ? `Created on ${taskCreatedDate}. Cannot complete prior to creation date.`
                      : isFuture
                      ? `Cannot mark completed for future dates (${selectedDate}).`
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {isDisabled ? (
                      <span className="text-slate-400 text-xs font-bold font-mono">🔒</span>
                    ) : isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-xs font-semibold">{task.title}</span>
                  </div>
                  {isBeforeCreated ? (
                    <span className="text-[10px] text-slate-400 font-mono">Prior to Creation</span>
                  ) : isFuture ? (
                    <span className="text-[10px] text-slate-400 font-mono">Future Date</span>
                  ) : task.scheduledTime && (
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                      {task.scheduledTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Evening Bedtime Log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
            <h3 className="font-bold text-slate-900 text-base">Evening Early Sleep Log</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Target Bedtime</label>
              <input
                type="time"
                value={dailyLog.targetSleepTime || '22:00'}
                onChange={(e) => onUpdateDailyLog(selectedDate, { targetSleepTime: e.target.value })}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Actual Bedtime</label>
              <input
                type="time"
                value={dailyLog.actualSleepTime || ''}
                onChange={(e) => onUpdateDailyLog(selectedDate, { actualSleepTime: e.target.value })}
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Early Sleeper Toggle & Quality */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateDailyLog(selectedDate, { sleptEarly: !dailyLog.sleptEarly })}
              className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                dailyLog.sleptEarly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4 text-emerald-600" />
              {dailyLog.sleptEarly ? 'Early Sleeper Met!' : 'Slept Late / Pending'}
            </button>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium block text-[11px] mb-1">Quality Rating</span>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    onClick={() => onUpdateDailyLog(selectedDate, { sleepQuality: q })}
                    className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                      sleepQuality === q ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Night Routine Checklist */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Night Wind-Down Routine</h4>
            {sleepTasks.map((task) => {
              const todayStr = getTodayDateString();
              const taskCreatedDate = (task.createdAt || selectedDate).split('T')[0];
              const isBeforeCreated = selectedDate < taskCreatedDate;
              const isFuture = selectedDate > todayStr;
              const isDisabled = isBeforeCreated || isFuture;
              const isDone = !isDisabled && !!task.completedDates[selectedDate];
              return (
                <div
                  key={task.id}
                  onClick={() => !isDisabled && onToggleTask(task.id, selectedDate)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isDisabled
                      ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : isDone
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-400 line-through cursor-pointer'
                      : 'bg-slate-50 border-slate-100 text-slate-900 cursor-pointer hover:border-slate-200'
                  }`}
                  title={
                    isBeforeCreated
                      ? `Created on ${taskCreatedDate}. Cannot complete prior to creation date.`
                      : isFuture
                      ? `Cannot mark completed for future dates (${selectedDate}).`
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {isDisabled ? (
                      <span className="text-slate-400 text-xs font-bold font-mono">🔒</span>
                    ) : isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="text-xs font-semibold">{task.title}</span>
                  </div>
                  {isBeforeCreated ? (
                    <span className="text-[10px] text-slate-400 font-mono">Prior to Creation</span>
                  ) : isFuture ? (
                    <span className="text-[10px] text-slate-400 font-mono">Future Date</span>
                  ) : task.scheduledTime && (
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                      {task.scheduledTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Science & Principles of Early Sleeper System */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 text-slate-700 text-xs shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          The 4 Rules of Early Sleeper Mastery
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <div className="font-bold text-amber-600 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" /> 1. Morning Light
            </div>
            <p className="text-slate-600 text-[11px]">
              Get 10-15 mins of direct natural light within 30 mins of waking to set cortisol & melatonin timers.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <div className="font-bold text-indigo-600 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" /> 2. 9:15 PM Screen Off
            </div>
            <p className="text-slate-600 text-[11px]">
              Blue light suppresses melatonin by up to 50%. Switch devices to night mode or read physical paper.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <div className="font-bold text-emerald-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 3. 10:00 PM Bedtime
            </div>
            <p className="text-slate-600 text-[11px]">
              Human physical repair and human growth hormone secretion peak between 10 PM and 2 AM.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
            <div className="font-bold text-blue-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> 4. Hydrate & Stretch
            </div>
            <p className="text-slate-600 text-[11px]">
              Drink 500ml water at 6:00 AM immediately after waking to activate metabolism and kidney filtration.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
