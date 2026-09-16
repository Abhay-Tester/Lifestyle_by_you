import React, { useState, useMemo, useEffect } from 'react';
import { Task, TaskCategory } from '../types';
import { 
  BarChart3, 
  Calendar, 
  Plus, 
  Filter, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Clock,
  GripVertical,
  ChevronUp,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

interface HabitMatrixSheetProps {
  tasks: Task[];
  onToggleTask: (taskId: string, date: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completedDates' | 'createdAt'>) => void;
  onUpdateTask?: (taskId: string, partial: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  onReorderTasks?: (reorderedTasks: Task[]) => void;
  onMoveTask?: (taskId: string, direction: 'up' | 'down') => void;
  selectedDate: string;
}

export type DateRangeCategory = '3_days' | '1_week' | '1_month' | '3_months' | 'custom';

// Date format helper YYYY-MM-DD
const formatDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Date parse helper
const parseDateStr = (str: string): Date => {
  if (!str) return new Date();
  const parts = str.split('-').map(Number);
  if (parts.length < 3) return new Date();
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

export const HabitMatrixSheet: React.FC<HabitMatrixSheetProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
  onMoveTask,
  selectedDate,
}) => {
  // Date Range Category Filter (Default: '3_days')
  const [rangeCategory, setRangeCategory] = useState<DateRangeCategory>('3_days');
  const [threeDayOffset, setThreeDayOffset] = useState(0); // 0 = today, tomorrow, day after tomorrow
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current 7 days
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month

  // Custom Date Range
  const [customStartDate, setCustomStartDate] = useState(selectedDate);
  const [customEndDate, setCustomEndDate] = useState(() => {
    const d = parseDateStr(selectedDate);
    d.setDate(d.getDate() + 6);
    return formatDateStr(d);
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('study');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Edit Task State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('study');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editTime, setEditTime] = useState('');
  const [editRecurring, setEditRecurring] = useState<Task['recurring']>('daily');
  const [editNotes, setEditNotes] = useState('');

  // Custom Delete Confirmation Modal State
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Drag & Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const handleOpenEdit = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setEditingTask(task);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditTime(task.scheduledTime || '');
    setEditRecurring(task.recurring || 'daily');
    setEditNotes(task.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    if (onUpdateTask) {
      onUpdateTask(editingTask.id, {
        title: editTitle.trim(),
        category: editCategory,
        priority: editPriority,
        scheduledTime: editTime,
        recurring: editRecurring,
        notes: editNotes.trim(),
      });
    }

    setEditingTask(null);
  };

  const handlePromptDelete = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    if (onDeleteTask) {
      onDeleteTask(deletingTask.id);
    }
    if (editingTask?.id === deletingTask.id) {
      setEditingTask(null);
    }
    setDeletingTask(null);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    setDragOverTaskId(null);
    const sourceTaskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    setDraggedTaskId(null);

    if (!sourceTaskId || sourceTaskId === targetTaskId) return;

    if (onReorderTasks) {
      const sourceIndex = tasks.findIndex((t) => t.id === sourceTaskId);
      const targetIndex = tasks.findIndex((t) => t.id === targetTaskId);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newTasks = [...tasks];
        const [movedItem] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(targetIndex, 0, movedItem);
        onReorderTasks(newTasks);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  // Customizable Habit List Column Width State (Default 280px, range 160px - 600px)
  const [habitColWidth, setHabitColWidth] = useState<number>(() => {
    const saved = localStorage.getItem('lifestyle_habit_col_width');
    return saved ? Math.max(160, Math.min(600, Number(saved))) : 280;
  });

  // Mobile viewport detection
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effective Column Width: reduced on mobile so date cells aren't squeezed out
  const effectiveColWidth = isMobileScreen ? Math.min(habitColWidth, 135) : habitColWidth;

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = habitColWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(160, Math.min(600, startWidth + delta));
      setHabitColWidth(newWidth);
      localStorage.setItem('lifestyle_habit_col_width', String(newWidth));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Dynamically generate daysList based on rangeCategory & offsets
  const daysList = useMemo(() => {
    const list = [];
    const baseDateObj = parseDateStr(selectedDate);

    let startDate: Date;
    let totalDays = 3;

    if (rangeCategory === '3_days') {
      startDate = new Date(baseDateObj);
      startDate.setDate(startDate.getDate() + (threeDayOffset * 3));
      totalDays = 3;
    } else if (rangeCategory === '1_week') {
      startDate = new Date(baseDateObj);
      startDate.setDate(startDate.getDate() + (weekOffset * 7));
      totalDays = 7;
    } else if (rangeCategory === '1_month') {
      const curMonth = new Date(baseDateObj.getFullYear(), baseDateObj.getMonth() + monthOffset, 1);
      startDate = curMonth;
      totalDays = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 0).getDate();
    } else if (rangeCategory === '3_months') {
      const curQuarter = new Date(baseDateObj.getFullYear(), baseDateObj.getMonth() + (monthOffset * 3), 1);
      startDate = curQuarter;
      totalDays = 90;
    } else {
      // Custom Date Range
      startDate = parseDateStr(customStartDate);
      const endDate = parseDateStr(customEndDate);
      const diffTime = Math.max(0, endDate.getTime() - startDate.getTime());
      const diffDays = Math.min(120, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
      totalDays = Math.max(1, diffDays);
    }

    for (let i = 0; i < totalDays; i++) {
      const cur = new Date(startDate);
      cur.setDate(cur.getDate() + i);
      const dateStr = formatDateStr(cur);
      const dayOfWeekShort = cur.toLocaleDateString('en-US', { weekday: 'short' });
      const monthShort = cur.toLocaleDateString('en-US', { month: 'short' });

      list.push({
        dayNumber: cur.getDate(),
        monthShort,
        dateStr,
        dayOfWeek: dayOfWeekShort,
        isToday: dateStr === selectedDate,
      });
    }

    return list;
  }, [rangeCategory, threeDayOffset, weekOffset, monthOffset, customStartDate, customEndDate, selectedDate]);

  // Filter tasks based on selected habit category
  const filteredTasks = useMemo(() => {
    if (selectedCategory === 'all') return tasks;
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  // Calculate completion check for 3-day mode (Auto-advance trigger)
  const isAllThreeDaysCompleted = useMemo(() => {
    if (rangeCategory !== '3_days' || filteredTasks.length === 0) return false;
    return daysList.every((day) =>
      filteredTasks.every((task) => !!task.completedDates[day.dateStr])
    );
  }, [rangeCategory, filteredTasks, daysList]);

  // Calculate completed task count per date across filtered tasks
  const dailyCompletedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    daysList.forEach((day) => {
      let count = 0;
      filteredTasks.forEach((task) => {
        if (task.completedDates[day.dateStr]) {
          count++;
        }
      });
      counts[day.dateStr] = count;
    });
    return counts;
  }, [daysList, filteredTasks]);

  // Overall stats
  const totalTasksListed = filteredTasks.length;
  const totalPossibleTarget = totalTasksListed * daysList.length;
  const totalTasksCompleted = useMemo(() => {
    return (Object.values(dailyCompletedCounts) as number[]).reduce((acc: number, val: number) => acc + val, 0);
  }, [dailyCompletedCounts]);

  const successRate = totalPossibleTarget > 0 
    ? Math.round((totalTasksCompleted / totalPossibleTarget) * 100) 
    : 0;

  // Habit color mapping
  const getCategoryColor = (category: TaskCategory, index: number) => {
    const colors = [
      { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
      { bg: 'bg-indigo-600', text: 'text-indigo-700', border: 'border-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
      { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-600', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
      { bg: 'bg-cyan-500', text: 'text-cyan-700', border: 'border-cyan-600', badge: 'bg-cyan-50 text-cyan-700 border border-cyan-200' },
      { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-600', badge: 'bg-rose-50 text-rose-700 border border-rose-200' },
      { bg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-600', badge: 'bg-purple-50 text-purple-700 border border-purple-200' },
    ];
    const categoryNames: Record<string, string> = {
      wake_routine: 'Wake Routine',
      night_routine: 'Night Routine',
      study: 'Study',
      exercise: 'Exercise',
      health: 'Gut & Health',
      general: 'General',
    };
    const c = colors[index % colors.length];
    return {
      ...c,
      name: categoryNames[category] || 'Habit',
    };
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      recurring: 'daily',
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  // Range label display
  const rangeLabel = useMemo(() => {
    if (daysList.length === 0) return '';
    const first = daysList[0];
    const last = daysList[daysList.length - 1];
    if (rangeCategory === '3_days') {
      if (threeDayOffset === 0) return `Today, Tomorrow & Day After (${first.monthShort} ${first.dayNumber} - ${last.monthShort} ${last.dayNumber})`;
      return `3 Days Window (${first.monthShort} ${first.dayNumber} - ${last.monthShort} ${last.dayNumber})`;
    }
    if (rangeCategory === '1_week') {
      return `1 Week (${first.monthShort} ${first.dayNumber} - ${last.monthShort} ${last.dayNumber})`;
    }
    if (rangeCategory === '1_month') {
      return `${first.monthShort} (${daysList.length} Days)`;
    }
    if (rangeCategory === '3_months') {
      return `3 Months (${first.monthShort} - ${last.monthShort})`;
    }
    return `Custom Range (${first.dateStr} to ${last.dateStr})`;
  }, [daysList, rangeCategory, threeDayOffset]);

  return (
    <div className="space-y-6">
      
      {/* 3-Day Completion Alert Banner */}
      {isAllThreeDaysCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
              <CheckCircle2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-emerald-950 text-sm">🎉 All Checklist Items Completed for these 3 Days!</div>
              <div className="text-emerald-700 text-xs mt-0.5">You checked off every single habit. Ready for the next 3 days?</div>
            </div>
          </div>

          <button
            onClick={() => setThreeDayOffset((prev) => prev + 1)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-xs shrink-0"
          >
            <span>Show Next 3 Days</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Habit Matrix Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-4 p-3 sm:p-5">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                Habit
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold focus:outline-hidden pr-2 capitalize cursor-pointer max-w-[130px] sm:max-w-none truncate"
              >
                <option value="all">All Categories</option>
                <option value="wake_routine">🌅 Wake Routine</option>
                <option value="night_routine">🌙 Night Routine</option>
                <option value="study">📚 Study</option>
                <option value="exercise">🏋️ Exercise</option>
                <option value="health">🥗 Gut & Health</option>
                <option value="general">⚡ General</option>
              </select>
            </div>

            {/* Add Habit Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> 
              <span>Add Habit</span>
            </button>
          </div>
        </div>

        {/* Date Filter & Range Controls Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Date Category Selector Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Date Filter:
            </span>

            <button
              onClick={() => { setRangeCategory('3_days'); setThreeDayOffset(0); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                rangeCategory === '3_days'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              ⚡ 3 Days (Default)
            </button>

            <button
              onClick={() => { setRangeCategory('1_week'); setWeekOffset(0); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                rangeCategory === '1_week'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              📅 1 Week
            </button>

            <button
              onClick={() => { setRangeCategory('1_month'); setMonthOffset(0); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                rangeCategory === '1_month'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              📊 1 Month
            </button>

            <button
              onClick={() => { setRangeCategory('3_months'); setMonthOffset(0); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                rangeCategory === '3_months'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              📈 3 Months
            </button>

            <button
              onClick={() => setRangeCategory('custom')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                rangeCategory === 'custom'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              📆 Custom Range
            </button>
          </div>

          {/* Active Range Navigation */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {rangeCategory === 'custom' ? (
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-slate-200">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                />
                <span className="text-slate-400 font-bold">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => {
                      if (rangeCategory === '3_days') setThreeDayOffset((prev) => prev - 1);
                      if (rangeCategory === '1_week') setWeekOffset((prev) => prev - 1);
                      if (rangeCategory === '1_month' || rangeCategory === '3_months') setMonthOffset((prev) => prev - 1);
                    }}
                    className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                    title="Previous Date Range"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-semibold text-slate-800 px-2 text-[11px] truncate max-w-[220px]">
                    {rangeLabel}
                  </span>

                  <button
                    onClick={() => {
                      if (rangeCategory === '3_days') setThreeDayOffset((prev) => prev + 1);
                      if (rangeCategory === '1_week') setWeekOffset((prev) => prev + 1);
                      if (rangeCategory === '1_month' || rangeCategory === '3_months') setMonthOffset((prev) => prev + 1);
                    }}
                    className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                    title="Next Date Range"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {(threeDayOffset !== 0 || weekOffset !== 0 || monthOffset !== 0) && (
                  <button
                    onClick={() => { setThreeDayOffset(0); setWeekOffset(0); setMonthOffset(0); }}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-1"
                    title="Reset to Today"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Today</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl no-scrollbar">
            <table className="w-full text-left border-collapse min-w-full sm:min-w-[650px]">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th 
                    className="p-3 sticky left-0 bg-slate-900 z-10 border-b border-slate-800 border-r border-slate-800 relative select-none"
                    style={{ width: effectiveColWidth, minWidth: effectiveColWidth, maxWidth: effectiveColWidth }}
                  >
                    <div className="flex items-center justify-between pr-2">
                      <span className="truncate">HABITS ({filteredTasks.length})</span>
                    </div>
                    {/* Mouse Drag Handle to Expand Width (Desktop only) */}
                    <div
                      onMouseDown={handleMouseDownResize}
                      className="hidden sm:block absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-indigo-500/80 active:bg-indigo-500 transition-colors z-20 group"
                      title="Drag left/right to resize column width"
                    >
                      <div className="w-0.5 h-full bg-slate-700 group-hover:bg-indigo-400 mx-auto" />
                    </div>
                  </th>
                  <th className="p-2 w-14 text-center border-b border-slate-800 border-r border-slate-800">
                    GOAL
                  </th>

                  {/* Day Columns with Number of Completed Tasks at top */}
                  {daysList.map((day) => {
                    const completedCountOnDate = dailyCompletedCounts[day.dateStr] || 0;
                    return (
                      <th 
                        key={day.dateStr}
                        className={`p-1 text-center border-b border-r border-slate-800 min-w-[38px] sm:min-w-[42px] ${
                          day.isToday ? 'bg-indigo-950 text-indigo-200 font-extrabold' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center py-1">
                          {/* Number of tasks completed on this date */}
                          <span className={`text-[10px] sm:text-[11px] font-mono font-bold leading-tight px-1.5 py-0.5 rounded ${
                            completedCountOnDate > 0 ? 'text-emerald-400 bg-emerald-950/80' : 'text-slate-500'
                          }`}>
                            {completedCountOnDate}
                          </span>

                          {/* Date Number */}
                          <span className="text-[11px] sm:text-xs font-mono font-bold text-white mt-1">
                            {day.dayNumber}
                          </span>

                          {/* Day of Week */}
                          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                            {day.dayOfWeek}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  <th className="p-2 sm:p-3 w-28 sm:w-32 text-center border-b border-slate-800 sticky right-0 bg-slate-900 z-10">
                    PROGRESS
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={daysList.length + 3} className="p-8 text-center text-slate-400">
                      No habits listed in this category. Click <strong>Add Habit</strong> to get started!
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, tIdx) => {
                    const colorTheme = getCategoryColor(task.category, tIdx);

                    // Calculate task completion count across displayed days
                    const taskCompletedDaysCount = daysList.filter(
                      (d) => task.completedDates && task.completedDates[d.dateStr]
                    ).length;

                    const targetGoal = daysList.length;
                    const rowPercentage = Math.round((taskCompletedDaysCount / targetGoal) * 100);

                    const isDraggingThis = draggedTaskId === task.id;
                    const isDragOverThis = dragOverTaskId === task.id;

                    return (
                      <tr 
                        key={task.id} 
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragOver={(e) => handleDragOver(e, task.id)}
                        onDrop={(e) => handleDrop(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className={`transition-colors group ${
                          isDraggingThis ? 'opacity-40 bg-indigo-50/50' :
                          isDragOverThis ? 'bg-indigo-100/60 border-y-2 border-indigo-500' :
                          'hover:bg-slate-50'
                        }`}
                      >
                        {/* Habit Name Column */}
                        <td 
                          className="p-1.5 sm:p-2 font-semibold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-xs"
                          style={{ width: effectiveColWidth, minWidth: effectiveColWidth, maxWidth: effectiveColWidth }}
                        >
                          <div className="flex items-center justify-between gap-1 group/row">
                            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
                              {/* Drag Handle (Desktop) */}
                              <span 
                                className="hidden sm:inline-block cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-600 rounded transition-colors shrink-0"
                                title="Click and drag to reorder habit"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </span>

                              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${colorTheme.bg} shrink-0`} />
                              
                              <span className="truncate text-slate-900 font-semibold text-xs leading-tight" title={task.title}>
                                {task.title}
                              </span>
                            </div>

                            {/* Quick Actions: Edit & Delete */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleOpenEdit(e, task)}
                                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handlePromptDelete(e, task)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Goal Column */}
                        <td className="p-1.5 sm:p-2 text-center font-mono font-bold text-slate-600 border-r border-slate-200 text-xs">
                          {targetGoal}
                        </td>

                        {/* Checkboxes for each date */}
                        {daysList.map((day) => {
                          const isChecked = !!(task.completedDates && task.completedDates[day.dateStr]);

                          return (
                            <td 
                              key={day.dateStr}
                              className={`p-1 text-center border-r border-slate-200 align-middle ${
                                day.isToday ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => onToggleTask(task.id, day.dateStr)}
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold font-mono transition-all duration-150 mx-auto text-xs cursor-pointer ${
                                  isChecked
                                    ? `${colorTheme.bg} text-white shadow-xs scale-105`
                                    : 'border border-slate-300 hover:border-slate-400 bg-white text-transparent hover:text-slate-300'
                                }`}
                                title={`${task.title} on ${day.dateStr}: ${isChecked ? 'Completed ✓' : 'Mark Completed'}`}
                              >
                                {isChecked ? '✓' : ''}
                              </button>
                            </td>
                          );
                        })}

                        {/* Progress Column */}
                        <td className="p-1.5 sm:p-2 sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-slate-200 shadow-xs">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-mono font-bold text-[11px] sm:text-xs text-slate-700 w-8 sm:w-10 text-right">
                              {rowPercentage}%
                            </span>
                            <div className="flex-1 bg-slate-100 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-200 min-w-[30px] sm:min-w-[40px]">
                              <div 
                                className={`h-full ${colorTheme.bg} transition-all duration-300 rounded-full`}
                                style={{ width: `${Math.min(rowPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Table Footer Summary Row */}
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs border-t-2 border-slate-800">
                  <td 
                    className="p-2 sm:p-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-800"
                    style={{ width: effectiveColWidth, minWidth: effectiveColWidth, maxWidth: effectiveColWidth }}
                  >
                    <span className="truncate block text-xs">TOTAL COMPLETED</span>
                  </td>
                  <td className="p-1.5 sm:p-2 text-center border-r border-slate-800 font-mono text-slate-400 text-xs">
                    -
                  </td>

                  {daysList.map((day) => {
                    const dayTotal = dailyCompletedCounts[day.dateStr] || 0;
                    return (
                      <td 
                        key={day.dateStr}
                        className="p-1 sm:p-2 text-center border-r border-slate-800 font-mono font-extrabold text-emerald-400 text-xs"
                      >
                        {dayTotal}
                      </td>
                    );
                  })}

                  <td className="p-2 sm:p-3 sticky right-0 bg-slate-900 z-10 text-center font-mono text-xs text-emerald-400">
                    {totalTasksCompleted} / {totalPossibleTarget}
                  </td>
                </tr>
              </tfoot>

            </table>
          </div>

      </div>

      {/* Add New Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add Habit to Matrix Sheet
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Habit / Routine Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Walk 10,000 steps or Read 15 mins"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none capitalize text-slate-900"
                  >
                    <option value="wake_routine">🌅 Wake Routine</option>
                    <option value="night_routine">🌙 Night Routine</option>
                    <option value="study">📚 Study</option>
                    <option value="exercise">🏋️ Exercise</option>
                    <option value="health">🥗 Gut & Health</option>
                    <option value="general">⚡ General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:border-indigo-500 focus:outline-none capitalize text-slate-900"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Add to Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Habit / Routine Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-indigo-600" />
                Edit Routine Habit
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Habit / Routine Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Wake up at 6am, Read 15 mins, Exercise"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:bg-white focus:border-indigo-500 focus:outline-none font-medium"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold capitalize"
                  >
                    <option value="wake_routine">🌅 Wake Routine</option>
                    <option value="night_routine">🌙 Night Routine</option>
                    <option value="study">📚 Study</option>
                    <option value="exercise">🏋️ Exercise</option>
                    <option value="health">🥗 Gut & Health</option>
                    <option value="general">⚡ General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold capitalize"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Time & Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Frequency
                  </label>
                  <select
                    value={editRecurring}
                    onChange={(e) => setEditRecurring(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none font-semibold"
                  >
                    <option value="daily">Everyday (Daily)</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekends">Weekends Only</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notes / Instructions
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => handlePromptDelete(e, editingTask)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Habit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Habit?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete <strong className="text-slate-900 font-bold">"{deletingTask.title}"</strong>?
                This will remove the habit and all its checkmark data.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTask(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
