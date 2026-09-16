import React, { useState } from 'react';
import { Goal, GoalMilestone } from '../types';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Calendar, 
  Flame, 
  Heart, 
  Briefcase, 
  BookOpen, 
  IndianRupee, 
  Smile, 
  TrendingUp,
  Trash2
} from 'lucide-react';

interface GoalManagerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (goalId: string, partial: Partial<Goal>) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalManager: React.FC<GoalManagerProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onToggleMilestone,
  onDeleteGoal,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'health' | 'career' | 'learning' | 'finance' | 'lifestyle' | 'mindset'>('health');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [motivation, setMotivation] = useState('');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['Milestone 1', 'Milestone 2']);

  const handleAddMilestoneField = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, milestoneInput.trim()]);
    setMilestoneInput('');
  };

  const handleRemoveMilestoneField = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedMilestones: GoalMilestone[] = milestones.map((m, i) => ({
      id: `m-${Date.now()}-${i}`,
      title: m,
      completed: false,
    }));

    onAddGoal({
      title,
      category,
      targetDate,
      progress: 0,
      status: 'in_progress',
      motivation: motivation || 'Driven by long term vision and personal mastery.',
      milestones: formattedMilestones,
    });

    setTitle('');
    setMotivation('');
    setMilestones(['Milestone 1']);
    setShowAddModal(false);
  };

  const categoryIcons = {
    health: Heart,
    career: Briefcase,
    learning: BookOpen,
    finance: IndianRupee,
    lifestyle: Smile,
    mindset: Sparkles,
  };

  return (
    <div className="space-y-6">

      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            What is the Goal?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track major life targets, milestones, and step-by-step progress.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const Icon = categoryIcons[goal.category] || Target;
          const completedMilestones = goal.milestones.filter(m => m.completed).length;
          const totalMilestones = goal.milestones.length;

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {goal.category}
                  </span>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-slate-900">{goal.title}</h3>

                {goal.motivation && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{goal.motivation}"
                  </p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>Progress: {completedMilestones}/{totalMilestones} Milestones</span>
                    <span className="font-mono text-indigo-600 font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Milestone Steps</div>
                  <div className="space-y-1.5 text-xs">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => onToggleMilestone(goal.id, m.id)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                            : 'bg-slate-50/50 border-slate-200 text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="font-medium">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target: {goal.targetDate}
                </span>
                <span className="capitalize text-slate-700 font-medium">{goal.status.replace('_', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <Target className="w-5 h-5 text-indigo-600" />
                Define New Life Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Run a half marathon & maintain 10% body fat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="health">❤️ Health & Fitness</option>
                    <option value="career">💼 Career & Business</option>
                    <option value="learning">📚 Learning & Mastery</option>
                    <option value="finance">💰 Finance & Wealth</option>
                    <option value="lifestyle">✨ Lifestyle & Travel</option>
                    <option value="mindset">🧘 Mindset & Spirit</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Core Motivation / Why</label>
                <textarea
                  rows={2}
                  placeholder="What drives you to achieve this goal?"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Milestones Fields */}
              <div className="space-y-2">
                <label className="text-slate-600 font-medium block">Milestones / Sub-tasks</label>
                <div className="space-y-2">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 font-mono text-slate-400">{idx + 1}.</span>
                      <input
                        type="text"
                        value={m}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx] = e.target.value;
                          setMilestones(updated);
                        }}
                        className="flex-1 bg-white border border-slate-200 text-slate-900 p-2 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestoneField(idx)}
                        className="text-red-500 hover:text-red-700 p-1 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add milestone step..."
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 text-slate-900 p-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestoneField}
                    className="bg-slate-100 border border-slate-200 text-indigo-600 px-3 py-2 rounded-lg font-semibold hover:bg-slate-200"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
