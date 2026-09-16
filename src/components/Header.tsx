import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { formatDateFriendly, shiftDate, getTodayDateString } from '../utils/date';
import { exportAllUserData, importUserData, resetAllDataToDefault } from '../utils/storage';
import { UserProfile } from '../types';

interface HeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenQuickAdd: () => void;
  earlySleepStreak?: number;
  todayCompletionRate?: number;
  waterIntakeMl?: number;
  waterGoalMl?: number;
  todayStudyMins?: number;
  onDataRefresh: () => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  userId?: string;
}

const MOTIVATION_QUOTES = [
  "Small daily disciplines compound into monumental life victories.",
  "Win the morning, master your mind, conquer your goals.",
  "Focus on progress, not perfection. Every day counts.",
  "Your future is created by what you do today, not tomorrow.",
  "Consistency is the bridge between goals and achievement.",
  "Deep focus, clean habits, unstoppable momentum."
];

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  setSelectedDate,
  onOpenQuickAdd,
  onDataRefresh,
  userProfile,
  onOpenProfile,
  onLogout,
  userId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isToday = selectedDate === getTodayDateString();

  // Dynamic daily motivation line
  const [motivationQuote, setMotivationQuote] = useState(() => {
    const dayIndex = Math.abs(new Date(selectedDate).getDate() || 0) % MOTIVATION_QUOTES.length;
    return MOTIVATION_QUOTES[dayIndex] || MOTIVATION_QUOTES[0];
  });

  useEffect(() => {
    const dayIndex = Math.abs(new Date(selectedDate).getDate() || 0) % MOTIVATION_QUOTES.length;
    setMotivationQuote(MOTIVATION_QUOTES[dayIndex] || MOTIVATION_QUOTES[0]);
  }, [selectedDate]);

  const handleExport = () => {
    const dataStr = exportAllUserData(userId);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeOS_Backup_${selectedDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importUserData(content, userId)) {
        onDataRefresh();
        alert('Data successfully imported and refreshed!');
        setShowMenu(false);
      } else {
        alert('Error reading JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to clean defaults?')) {
      resetAllDataToDefault(userId);
      onDataRefresh();
      setShowMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between py-2 sm:py-0 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-sm shrink-0">
                ⚡
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">
                  Life style
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block font-medium">
                  Routines • Habits • Growth
                </p>
              </div>
            </div>
          </div>

          {/* Date Selector: Desktop View */}
          <div className="hidden sm:flex items-center justify-center bg-slate-800/90 p-1 sm:p-1.5 rounded-xl border border-slate-700/70 shadow-inner shrink-0">
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
              className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-100 min-w-[85px] sm:min-w-[110px] text-center whitespace-nowrap">
                {formatDateFriendly(selectedDate)}
              </span>
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(getTodayDateString())}
                  className="text-[10px] sm:text-xs text-emerald-400 hover:underline font-semibold ml-0.5 cursor-pointer"
                >
                  Today
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
              className="p-1 sm:p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Center Motivation Banner (Desktop only) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4 overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-medium max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span className="italic truncate text-slate-300">
                "{motivationQuote}"
              </span>
            </div>
          </div>

          {/* Action Buttons: Add Task, Profile & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Add Button */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1 sm:gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Entry</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* User Profile avatar quick link */}
            {userProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 p-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Account Profile"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline text-xs font-semibold">{userProfile.name?.split(' ')[0] || 'Profile'}</span>
              </button>
            )}

            {/* Menu / Settings dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title="Data & Settings"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Account & Profile
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenProfile) onOpenProfile();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Profile</span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  )}

                  <hr className="my-1.5 border-slate-700" />

                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Backup & Data
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Data (JSON)</span>
                  </button>

                  <label className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Import Data (JSON)</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImport} 
                      className="hidden" 
                    />
                  </label>

                  <hr className="my-1.5 border-slate-700" />

                  <button
                    onClick={handleReset}
                    className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                    <span>Reset to Template</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Dedicated Mobile Date Navigator Row (Phone only) */}
        <div className="sm:hidden pb-2.5 pt-1 flex items-center justify-between gap-1.5">
          <div className="flex-1 flex items-center justify-between bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 shadow-inner">
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-100 whitespace-nowrap">
                {formatDateFriendly(selectedDate)}
              </span>
            </div>

            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        {/* Mobile Motivation Quote Sub-bar */}
        <div className="md:hidden py-1.5 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-300 overflow-hidden">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="italic truncate">"{motivationQuote}"</span>
        </div>

      </div>
    </header>
  );
};
