import React, { useState } from 'react';
import { HabitChallenge, LadderStage } from '../types';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Award, 
  Lightbulb, 
  Clock, 
  ChevronRight,
  Flame,
  BookOpen,
  Moon,
  Dumbbell,
  HeartPulse,
  RotateCcw
} from 'lucide-react';

interface HabitLadderDashboardProps {
  selectedDate: string;
  challenges: HabitChallenge[];
  onToggleChallengeDate: (challengeId: string, date: string) => void;
  onAdvanceChallengeStage: (challengeId: string) => void;
  onAddChallenge: (challenge: Omit<HabitChallenge, 'id'>) => void;
  onResetChallengeProgress: (challengeId: string) => void;
}

export const HabitLadderDashboard: React.FC<HabitLadderDashboardProps> = ({
  selectedDate,
  challenges,
  onToggleChallengeDate,
  onAdvanceChallengeStage,
  onAddChallenge,
  onResetChallengeProgress,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitChallenge['category']>('study');
  const [newNotes, setNewNotes] = useState('');

  const getCategoryIcon = (category: HabitChallenge['category']) => {
    switch (category) {
      case 'wake_up': return Moon;
      case 'study': return BookOpen;
      case 'exercise': return Dumbbell;
      case 'health': return HeartPulse;
      default: return Zap;
    }
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddChallenge({
      title: newTitle,
      category: newCategory,
      targetDays: 3,
      completedDates: [],
      currentStage: '3_day',
      startDate: selectedDate,
      notes: newNotes,
      brainComfortTip: 'Step 1: Focus purely on 3 days. Your brain experiences zero overwhelm when the goal is just 3 days.',
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const stagesList = [
    {
      key: '3_day',
      name: 'Stage 1: 3-Day Horizon',
      days: 3,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Zero mental friction. Removes brain resistance by focusing only on 72 hours.',
      psychology: 'The amygdala perceives 3 days as non-threatening, preventing procrastination.',
    },
    {
      key: '6_day',
      name: 'Stage 2: 6-Day Expansion',
      days: 6,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Doubles habit momentum once the 3-day baseline is locked in.',
      psychology: 'Dopamine feedback loops reinforce task execution and lower effort sensation.',
    },
    {
      key: '11_day',
      name: 'Stage 3: 11-Day Neuro-Lock',
      days: 11,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'Consolidates synaptic pathways for effortless automated routine.',
      psychology: 'Neural myelination speeds up action execution with minimal willpower.',
    },
    {
      key: '21_day',
      name: 'Stage 4: Progressive +1 Expansion',
      days: 21,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'Daily continuous horizon expansion (+1 day daily growth).',
      psychology: 'Identity shift: "This is simply who I am and what I do every day."',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            Brain-Comfort Horizon Ladder (3 → 6 → 11 Days)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Focus on 3 days first. Once completed, step up to 6 days, then 11 days.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> New 3-Day Challenge
        </button>
      </div>

      {/* The Progressive Ladder Visualization */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Psychological Progress Escalation Model
            </h2>
            <p className="text-xs text-slate-500">How your brain comfortably adapts without burnout</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> New 3-Day Challenge
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stagesList.map((stage, idx) => (
            <div 
              key={stage.key}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${stage.badgeColor}`}>
                  {stage.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Step {idx + 1}</span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-800">{stage.days} Days Commitment</div>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.description}</p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 italic">
                💡 {stage.psychology}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Habit Expansion Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Your Active Brain-Comfort Sprints ({challenges.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Selected Date: {selectedDate}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const Icon = getCategoryIcon(challenge.category);
            const isCompletedToday = challenge.completedDates.includes(selectedDate);
            const completedCount = challenge.completedDates.length;
            const targetDays = challenge.targetDays;
            const progressPercent = Math.min(Math.round((completedCount / targetDays) * 100), 100);
            const canAdvanceStage = completedCount >= targetDays;

            return (
              <div 
                key={challenge.id}
                className="bg-white border border-slate-200 hover:border-indigo-200 transition-all rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{challenge.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md capitalize">
                            {challenge.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-mono font-medium text-slate-500">
                            Current Target: <strong className="text-slate-800">{targetDays} Days</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onResetChallengeProgress(challenge.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1"
                      title="Reset challenge progress"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar & Days Indicator */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-600">Streak Completion Progress</span>
                      <span className="text-indigo-600 font-mono">{completedCount} / {targetDays} Days ({progressPercent}%)</span>
                    </div>

                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          progressPercent >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Day Nodes */}
                    <div className="flex justify-between pt-1">
                      {Array.from({ length: targetDays }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const isDone = dayNum <= completedCount;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isDone ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDone ? '✓' : dayNum}
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">Day {dayNum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brain Comfort Psychology Tip */}
                  {challenge.brainComfortTip && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{challenge.brainComfortTip}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onToggleChallengeDate(challenge.id, selectedDate)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isCompletedToday
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompletedToday ? `Completed Today (${selectedDate}) ✓` : `Mark Completed Today (${selectedDate})`}
                  </button>

                  {canAdvanceStage && (
                    <button
                      onClick={() => onAdvanceChallengeStage(challenge.id)}
                      className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md animate-bounce"
                    >
                      <Award className="w-4 h-4" />
                      <span>Expand Horizon!</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Psychology Patterns & Encouragement Hub */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Brain className="w-5 h-5 text-indigo-600" />
          Key Psychology Patterns for Continuous Task Execution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50/60 border border-indigo-100 p-5 rounded-2xl space-y-2">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              1. The 3-Day Rule (Zero Dread)
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Never ask yourself to study or wake up early for 30 days. Ask yourself to do it for <strong>3 days only</strong>. Your brain accepts short term commitments with ease, completely bypassing fear of failure.
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl space-y-2">
            <div className="font-bold text-emerald-950 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              2. Progressive Escalation (3 → 6 → 11)
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Once you hit 3 days, upgrade to 6 days. Once 6 days are hit, upgrade to 11 days. Each stage unlocks a boost in dopamine and self-efficacy, making the next 5 days feel lighter than the first 3!
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              3. Frictionless Environment
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Prepare your study desk and water bottle the night before. Sleeping early by 10 PM ensures your prefrontal cortex has 100% glucose energy to stay comfortable with complex tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Challenge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <Plus className="w-5 h-5 text-indigo-600" />
                Start New 3-Day Comfort Challenge
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Challenge Title (e.g., 90 Min Study Sprint)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Math / Code Practice"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none capitalize"
                >
                  <option value="study">📚 Deep Study Session</option>
                  <option value="wake_up">🌅 Sunrise Wake Up</option>
                  <option value="exercise">🏋️ Workout & Exercise</option>
                  <option value="health">🥗 Gut Health & Water</option>
                  <option value="general">⚡ General Habit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Execution Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Keep study table clean, phone in another room..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none h-20"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl text-[11px] text-indigo-800 font-medium">
                🎯 Target set to <strong>3 Days (Initial Horizon)</strong>. Once completed, your system will automatically offer the 6-Day Expansion!
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Start 3-Day Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
