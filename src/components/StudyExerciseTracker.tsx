import React, { useState, useEffect } from 'react';
import { StudySession, ExerciseLog } from '../types';
import { getTodayDateString } from '../utils/date';
import { 
  BookOpen, 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Flame, 
  Clock, 
  Award, 
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

interface StudyExerciseTrackerProps {
  selectedDate: string;
  studySessions: StudySession[];
  exerciseLogs: ExerciseLog[];
  onAddStudySession: (session: Omit<StudySession, 'id'>) => void;
  onAddExerciseLog: (exercise: Omit<ExerciseLog, 'id'>) => void;
  onToggleStudySession: (id: string) => void;
  onToggleExerciseLog: (id: string) => void;
}

export const StudyExerciseTracker: React.FC<StudyExerciseTrackerProps> = ({
  selectedDate,
  studySessions,
  exerciseLogs,
  onAddStudySession,
  onAddExerciseLog,
  onToggleStudySession,
  onToggleExerciseLog,
}) => {
  // Pomodoro Timer State
  const [timerSubject, setTimerSubject] = useState('Deep Work Study');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'deep_work' | 'reading' | 'practice' | 'revision'>('deep_work');

  // New Study Form
  const [newSubject, setNewSubject] = useState('');
  const [newStudyMins, setNewStudyMins] = useState(45);
  const [newStudyType, setNewStudyType] = useState<'reading' | 'practice' | 'deep_work' | 'revision' | 'lecture'>('deep_work');
  const [newStudyNotes, setNewStudyNotes] = useState('');

  // New Workout Form
  const [newWorkoutType, setNewWorkoutType] = useState<'cardio' | 'strength' | 'yoga' | 'walking' | 'sports' | 'stretching' | 'hiit'>('strength');
  const [newWorkoutMins, setNewWorkoutMins] = useState(45);
  const [newIntensity, setNewIntensity] = useState<'light' | 'moderate' | 'intense'>('moderate');
  const [newCalories, setNewCalories] = useState(300);
  const [newWorkoutNotes, setNewWorkoutNotes] = useState('');

  // Effect for Pomodoro timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Auto save completed study session
      onAddStudySession({
        date: selectedDate,
        subject: timerSubject || 'Pomodoro Study Block',
        durationMinutes: timerMinutes,
        type: sessionType,
        completed: true,
        notes: `Completed ${timerMinutes}m Pomodoro session on ${selectedDate}`,
      });
      alert(`🎉 Great job! You completed a ${timerMinutes}-minute focus block for ${timerSubject}.`);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, selectedDate, timerSubject, timerMinutes, sessionType, onAddStudySession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (mins: number) => {
    setIsRunning(false);
    setTimerMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const formatTimerDisplay = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const todayStudy = studySessions.filter((s) => s.date === selectedDate);
  const todayExercise = exerciseLogs.filter((e) => e.date === selectedDate);

  const totalStudyMins = todayStudy.reduce((acc, curr) => acc + (curr.completed ? curr.durationMinutes : 0), 0);
  const totalWorkoutMins = todayExercise.reduce((acc, curr) => acc + (curr.completed ? curr.durationMinutes : 0), 0);
  const totalCalories = todayExercise.reduce((acc, curr) => acc + (curr.completed ? (curr.caloriesBurned || 0) : 0), 0);

  const handleCreateStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    onAddStudySession({
      date: selectedDate,
      subject: newSubject,
      durationMinutes: newStudyMins,
      type: newStudyType,
      completed: true,
      notes: newStudyNotes,
    });
    setNewSubject('');
    setNewStudyNotes('');
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExerciseLog({
      date: selectedDate,
      workoutType: newWorkoutType,
      durationMinutes: newWorkoutMins,
      intensity: newIntensity,
      caloriesBurned: newCalories,
      completed: true,
      notes: newWorkoutNotes,
    });
    setNewWorkoutNotes('');
  };

  return (
    <div className="space-y-6">

      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Study & Exercise Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track study focus sessions and daily physical workouts.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0 text-xs">
          <div>
            <span className="text-slate-500 block">Study Today</span>
            <strong className="text-indigo-600 font-mono text-sm">{totalStudyMins} mins</strong>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500 block">Workout Today</span>
            <strong className="text-emerald-600 font-mono text-sm">{totalWorkoutMins} mins</strong>
          </div>
        </div>
      </div>

      {/* Interactive Pomodoro Focus Timer Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
            <h3 className="font-bold text-slate-900 text-lg">Interactive Study Focus Timer</h3>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetTimer(25)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                timerMinutes === 25 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => resetTimer(50)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                timerMinutes === 50 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              50m Deep Work
            </button>
            <button
              onClick={() => resetTimer(15)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                timerMinutes === 15 ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              15m Quick Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Timer Display */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
            <div className="text-5xl font-mono font-bold text-indigo-600 tracking-wider">
              {formatTimerDisplay(timeLeft)}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              {isRunning ? '🔥 Deep Work In Progress...' : 'Ready to Start Session'}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={toggleTimer}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                {isRunning ? 'Pause' : 'Start Focus'}
              </button>

              <button
                onClick={() => resetTimer(timerMinutes)}
                className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors shadow-sm"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject & Type Settings */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Subject / Focus Topic</label>
              <input
                type="text"
                value={timerSubject}
                onChange={(e) => setTimerSubject(e.target.value)}
                placeholder="e.g. System Design, Calculus, Organic Chemistry"
                className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Session Mode</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none capitalize font-medium text-xs"
                >
                  <option value="deep_work">⚡ Deep Work Block</option>
                  <option value="reading">📚 Reading & Research</option>
                  <option value="practice">📝 Problem Solving / Code</option>
                  <option value="revision">🔁 Flashcards & Revision</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Target Date</label>
                <div className="bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-xl font-mono text-xs">
                  {selectedDate}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Study Sessions & Exercise Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Study Time Manager Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              <h3 className="font-bold text-slate-900 text-base">Study Sessions Log</h3>
            </div>
            <span className="text-xs text-indigo-700 font-mono font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              {todayStudy.length} Sessions Today
            </span>
          </div>

          {/* Create Study Form */}
          <form onSubmit={handleCreateStudy} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="font-semibold text-slate-800">Manual Study Entry</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Subject Name..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 p-2 rounded-lg focus:border-indigo-500 focus:outline-none sm:col-span-2 font-medium"
                required
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Mins"
                  value={newStudyMins}
                  onChange={(e) => setNewStudyMins(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2 rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-center"
                  min={5}
                />
                <span className="text-slate-500 font-medium">m</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={newStudyType}
                onChange={(e) => setNewStudyType(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-800 p-2 rounded-lg text-xs capitalize"
              >
                <option value="deep_work">Deep Work</option>
                <option value="reading">Reading</option>
                <option value="practice">Practice</option>
                <option value="revision">Revision</option>
                <option value="lecture">Lecture</option>
              </select>

              <button
                type="submit"
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Session
              </button>
            </div>
          </form>

          {/* List of Study Sessions */}
          <div className="space-y-2.5">
            {todayStudy.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No study sessions logged for {selectedDate}. Use the Pomodoro timer above or manual entry to log study time.</p>
            ) : (
              todayStudy.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onToggleStudySession(s.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    s.completed
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-indigo-600">
                      {s.completed ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <Circle className="w-5 h-5 text-slate-300" />}
                    </button>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{s.subject}</div>
                      <div className="text-xs text-slate-500 capitalize">{s.type.replace('_', ' ')} • {s.notes || 'Focused study block'}</div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {s.durationMinutes} mins
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Exercise & Workout Manager Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
              <h3 className="font-bold text-slate-900 text-base">Exercise & Workout Manager</h3>
            </div>
            <span className="text-xs text-emerald-700 font-mono font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {todayExercise.length} Workouts Today
            </span>
          </div>

          {/* Create Workout Form */}
          <form onSubmit={handleCreateExercise} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="font-semibold text-slate-800">Log Exercise / Workout</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <select
                value={newWorkoutType}
                onChange={(e) => setNewWorkoutType(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-900 p-2 rounded-lg focus:border-emerald-500 focus:outline-none capitalize font-medium"
              >
                <option value="strength">💪 Strength / Lifting</option>
                <option value="cardio">🏃 Cardio / Running</option>
                <option value="hiit">⚡ HIIT / Circuit</option>
                <option value="yoga">🧘 Yoga / Mobility</option>
                <option value="walking">🚶 Brisk Walking</option>
                <option value="sports">🏀 Sports / Swimming</option>
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Duration (m)"
                  value={newWorkoutMins}
                  onChange={(e) => setNewWorkoutMins(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2 rounded-lg focus:border-emerald-500 focus:outline-none font-mono text-center"
                  min={5}
                />
                <span className="text-slate-500 font-medium">m</span>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Calories"
                  value={newCalories}
                  onChange={(e) => setNewCalories(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2 rounded-lg focus:border-emerald-500 focus:outline-none font-mono text-center"
                />
                <span className="text-slate-500 font-medium">kcal</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={newIntensity}
                onChange={(e) => setNewIntensity(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-800 p-2 rounded-lg text-xs capitalize"
              >
                <option value="light">Light Intensity</option>
                <option value="moderate">Moderate Intensity</option>
                <option value="intense">High Intensity 🔥</option>
              </select>

              <button
                type="submit"
                className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Workout
              </button>
            </div>
          </form>

          {/* List of Workout Logs */}
          <div className="space-y-2.5">
            {todayExercise.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No workout logs recorded for {selectedDate}. Stay active and log your session here!</p>
            ) : (
              todayExercise.map((e) => (
                <div
                  key={e.id}
                  onClick={() => onToggleExerciseLog(e.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    e.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-emerald-600">
                      {e.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-slate-300" />}
                    </button>
                    <div>
                      <div className="font-semibold text-sm text-slate-900 capitalize">{e.workoutType} Session</div>
                      <div className="text-xs text-slate-500 capitalize">{e.intensity} intensity • {e.caloriesBurned ? `${e.caloriesBurned} kcal burned` : 'Active movement'}</div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {e.durationMinutes} mins
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
