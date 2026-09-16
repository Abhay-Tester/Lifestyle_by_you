import React, { useState } from 'react';
import { Task, StudySession, ExerciseLog, MealLog, Goal, PurchaseItem } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  BookOpen, 
  Dumbbell, 
  Utensils, 
  Target, 
  ShoppingBag, 
  Moon,
  X 
} from 'lucide-react';

interface QuickAddModalProps {
  selectedDate: string;
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completedDates' | 'createdAt'>) => void;
  onAddStudySession: (session: Omit<StudySession, 'id'>) => void;
  onAddExerciseLog: (exercise: Omit<ExerciseLog, 'id'>) => void;
  onAddMealLog: (meal: Omit<MealLog, 'id'>) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onAddPurchase: (item: Omit<PurchaseItem, 'id' | 'createdAt'>) => void;
}

type AddType = 'task' | 'study' | 'exercise' | 'meal' | 'goal' | 'purchase';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  selectedDate,
  isOpen,
  onClose,
  onAddTask,
  onAddStudySession,
  onAddExerciseLog,
  onAddMealLog,
  onAddGoal,
  onAddPurchase,
}) => {
  if (!isOpen) return null;

  const [addType, setAddType] = useState<AddType>('task');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<Task['category']>('general');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium');
  const [taskTime, setTaskTime] = useState('08:00');
  const [taskNotes, setTaskNotes] = useState('');

  // Study form
  const [studySubject, setStudySubject] = useState('');
  const [studyMins, setStudyMins] = useState(60);
  const [studyType, setStudyType] = useState<StudySession['type']>('deep_work');

  // Exercise form
  const [workoutType, setWorkoutType] = useState<ExerciseLog['workoutType']>('cardio');
  const [workoutMins, setWorkoutMins] = useState(45);
  const [intensity, setIntensity] = useState<ExerciseLog['intensity']>('moderate');

  // Meal form
  const [mealType, setMealType] = useState<MealLog['mealType']>('breakfast');
  const [foodItems, setFoodItems] = useState('');
  const [digestionImpact, setDigestionImpact] = useState<MealLog['digestionImpact']>('easy');

  // Goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<Goal['category']>('health');

  // Purchase form
  const [purchaseName, setPurchaseName] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(100);
  const [purchasePriority, setPurchasePriority] = useState<PurchaseItem['priority']>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (addType === 'task') {
      if (!taskTitle.trim()) return;
      onAddTask({
        title: taskTitle,
        category: taskCategory,
        priority: taskPriority,
        scheduledTime: taskTime,
        recurring: 'daily',
        notes: taskNotes,
      });
    } else if (addType === 'study') {
      if (!studySubject.trim()) return;
      onAddStudySession({
        date: selectedDate,
        subject: studySubject,
        durationMinutes: studyMins,
        type: studyType,
        completed: true,
      });
    } else if (addType === 'exercise') {
      onAddExerciseLog({
        date: selectedDate,
        workoutType,
        durationMinutes: workoutMins,
        intensity,
        completed: true,
      });
    } else if (addType === 'meal') {
      if (!foodItems.trim()) return;
      onAddMealLog({
        date: selectedDate,
        time: '12:00',
        mealType,
        foodItems,
        digestionImpact,
        fiberRich: true,
      });
    } else if (addType === 'goal') {
      if (!goalTitle.trim()) return;
      onAddGoal({
        title: goalTitle,
        category: goalCategory,
        targetDate: '2026-12-31',
        progress: 0,
        status: 'in_progress',
        motivation: 'Pursuing consistent personal improvement.',
        milestones: [
          { id: `m-${Date.now()}-1`, title: 'Initial Milestone Step', completed: false }
        ]
      });
    } else if (addType === 'purchase') {
      if (!purchaseName.trim()) return;
      onAddPurchase({
        name: purchaseName,
        category: 'tech',
        priority: purchasePriority,
        estimatedCost: purchaseCost,
        status: 'planned',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-xl text-slate-900 max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
            <Plus className="w-5 h-5 text-indigo-600" />
            Quick Add Entry ({selectedDate})
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setAddType('task')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'task' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Task
          </button>

          <button
            onClick={() => setAddType('study')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'study' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Study
          </button>

          <button
            onClick={() => setAddType('exercise')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'exercise' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Workout
          </button>

          <button
            onClick={() => setAddType('meal')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'meal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Utensils className="w-3.5 h-3.5" /> Meal
          </button>

          <button
            onClick={() => setAddType('goal')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'goal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Target className="w-3.5 h-3.5" /> Goal
          </button>

          <button
            onClick={() => setAddType('purchase')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${addType === 'purchase' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Buy
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs pt-1">
          {addType === 'task' && (
            <>
              <div>
                <label className="text-slate-600 font-medium block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Drink 500ml water at 6:00 AM"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl text-xs font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="wake_routine">🌅 Wake-Up Routine</option>
                    <option value="night_routine">🌙 Night Routine (Early Sleep)</option>
                    <option value="study">📚 Study Session</option>
                    <option value="exercise">🏋️ Workout / Exercise</option>
                    <option value="health">🌱 Health & Digestion</option>
                    <option value="general">📋 General Task</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {addType === 'study' && (
            <>
              <div>
                <label className="text-slate-600 font-medium block mb-1">Subject / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={studySubject}
                  onChange={(e) => setStudySubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={studyMins}
                    onChange={(e) => setStudyMins(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono focus:border-indigo-500 focus:outline-none"
                    min={5}
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Type</label>
                  <select
                    value={studyType}
                    onChange={(e) => setStudyType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="deep_work">Deep Work</option>
                    <option value="reading">Reading</option>
                    <option value="practice">Practice</option>
                    <option value="revision">Revision</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {addType === 'exercise' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Workout Type</label>
                  <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="strength">Strength Training</option>
                    <option value="cardio">Cardio / Running</option>
                    <option value="yoga">Yoga / Stretching</option>
                    <option value="hiit">HIIT Workout</option>
                    <option value="walking">Brisk Walking</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={workoutMins}
                    onChange={(e) => setWorkoutMins(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {addType === 'meal' && (
            <>
              <div>
                <label className="text-slate-600 font-medium block mb-1">Food Items</label>
                <input
                  type="text"
                  placeholder="e.g. Grilled salmon, brown rice & steamed broccoli"
                  value={foodItems}
                  onChange={(e) => setFoodItems(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Digestion Impact</label>
                  <select
                    value={digestionImpact}
                    onChange={(e) => setDigestionImpact(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="easy">Easy on stomach</option>
                    <option value="neutral">Neutral</option>
                    <option value="heavy">Heavy</option>
                    <option value="irritating">Acidic/Irritating</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {addType === 'goal' && (
            <>
              <div>
                <label className="text-slate-600 font-medium block mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Advanced System Design"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {addType === 'purchase' && (
            <>
              <div>
                <label className="text-slate-600 font-medium block mb-1">Purchase Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Press Juicer for Gut Health"
                  value={purchaseName}
                  onChange={(e) => setPurchaseName(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-semibold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Estimated Cost (₹ Rupees)</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">Priority</label>
                  <select
                    value={purchasePriority}
                    onChange={(e) => setPurchasePriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 text-slate-900 p-2.5 rounded-xl capitalize font-medium focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="must_have">Must Have</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
            >
              Save Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
