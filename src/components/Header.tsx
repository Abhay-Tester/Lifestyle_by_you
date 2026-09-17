import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles,
  User,
  LogOut,
  Bell,
  Database,
  CheckCircle2,
  RefreshCw,
  WifiOff,
  Calendar
} from 'lucide-react';
import { getTodayDateString } from '../utils/date';
import { exportAllUserData, importUserData } from '../utils/storage';
import { UserProfile } from '../types';

interface HeaderProps {
  selectedDate?: string;
  setSelectedDate?: (date: string) => void;
  onOpenQuickAdd: () => void;
  earlySleepStreak?: number;
  todayCompletionRate?: number;
  waterIntakeMl?: number;
  waterGoalMl?: number;
  todayStudyMins?: number;
  onDataRefresh: () => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  userId?: string;
  cloudSyncStatus?: string;
  onManualCloudSync?: () => void;
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
  selectedDate = getTodayDateString(),
  setSelectedDate,
  onOpenQuickAdd,
  onDataRefresh,
  userProfile,
  onOpenProfile,
  onOpenNotifications,
  onLogout,
  userId,
  cloudSyncStatus = 'synced',
  onManualCloudSync,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Month & Date formatting for side-by-side display
  const dateParts = selectedDate ? selectedDate.split('-').map(Number) : [];
  const dateObj = dateParts.length === 3 ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) : new Date();
  const monthName = !isNaN(dateObj.getTime()) ? dateObj.toLocaleString('en-US', { month: 'long' }) : '';
  const dayNum = !isNaN(dateObj.getTime()) ? dateObj.getDate() : '';
  const yearNum = !isNaN(dateObj.getTime()) ? dateObj.getFullYear() : '';
  const weekdayShort = !isNaN(dateObj.getTime()) ? dateObj.toLocaleString('en-US', { weekday: 'short' }) : '';

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

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between py-2 sm:py-0 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title + Month & Date Display */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
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

            {/* Header Display: Month side-by-side with Date */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-semibold shadow-xs">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="text-amber-300 font-extrabold uppercase tracking-wider text-[11px] sm:text-xs">
                  {monthName}
                </span>
                <span className="text-slate-500 font-bold">|</span>
                <span className="text-white font-bold text-[11px] sm:text-xs">
                  {weekdayShort}, {dayNum} {yearNum}
                </span>
              </div>
              {setSelectedDate && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-slate-400 hover:text-white text-xs cursor-pointer focus:outline-none w-4 h-4 ml-0.5 opacity-80 hover:opacity-100 transition-opacity"
                  title="Select Date & Month"
                />
              )}
            </div>
          </div>

          {/* Center Motivation Banner */}
          <div className="hidden md:flex flex-1 items-center justify-center px-4 overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-medium max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span className="italic truncate text-slate-300">
                "{motivationQuote}"
              </span>
            </div>
          </div>

          {/* Action Buttons: Add Task, Database Badge, Profile & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Database Connection / Cloud Sync Status Button */}
            <button
              onClick={onManualCloudSync}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                cloudSyncStatus === 'syncing'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                  : cloudSyncStatus === 'offline'
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
              }`}
              title="Click to check or sync Cloud Firestore database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {cloudSyncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  <span className="hidden lg:inline text-[11px]">Syncing DB...</span>
                </>
              ) : cloudSyncStatus === 'offline' ? (
                <>
                  <WifiOff className="w-3 h-3 text-slate-400" />
                  <span className="hidden lg:inline text-[11px]">Local Mode</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="hidden lg:inline text-[11px] font-semibold">DB Connected</span>
                </>
              )}
            </button>

            {/* Quick Add Button */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1 sm:gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Entry</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 transition-colors cursor-pointer relative"
              title="Notifications & Phone Alerts"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
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
                    Cloud Database
                  </div>
                  <button
                    onClick={() => {
                      if (onManualCloudSync) onManualCloudSync();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync Firestore DB Now</span>
                  </button>

                  <hr className="my-1.5 border-slate-700" />

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
                </div>
              )}
            </div>
          </div>

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

