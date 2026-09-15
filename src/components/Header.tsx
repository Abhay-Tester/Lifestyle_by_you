import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Flame, 
  CheckCircle2, 
  Droplet, 
  BookOpen,
  Cloud,
  CloudCheck,
  RefreshCw,
  User,
  LogOut
} from 'lucide-react';
import { formatDateFriendly, shiftDate, getTodayDateString } from '../utils/date';
import { exportAllUserData, importUserData, resetAllDataToDefault } from '../utils/storage';
import { UserProfile } from '../types';

interface HeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenQuickAdd: () => void;
  earlySleepStreak: number;
  todayCompletionRate: number;
  waterIntakeMl: number;
  waterGoalMl: number;
  todayStudyMins: number;
  onDataRefresh: () => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  onManualCloudSync: () => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  setSelectedDate,
  onOpenQuickAdd,
  earlySleepStreak,
  todayCompletionRate,
  waterIntakeMl,
  waterGoalMl,
  todayStudyMins,
  onDataRefresh,
  cloudSyncStatus,
  onManualCloudSync,
  userProfile,
  onOpenProfile,
  onLogout,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isToday = selectedDate === getTodayDateString();

  const handleExport = () => {
    const dataStr = exportAllUserData();
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
      if (content && importUserData(content)) {
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
      resetAllDataToDefault();
      onDataRefresh();
      setShowMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center font-black text-white text-lg shadow-sm">
                ⚡
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Life style
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    Firestore Connected
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Routines • Health • Goals • Purchases</p>
              </div>
            </div>

            {/* Quick Add Button Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenQuickAdd}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Date Selector Navigation Bar */}
          <div className="flex items-center justify-center bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-100 min-w-[110px] text-center">
                {formatDateFriendly(selectedDate)}
              </span>
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(getTodayDateString())}
                  className="text-xs text-emerald-400 hover:underline font-medium ml-1"
                >
                  Today
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Bar & Action Buttons */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            {/* Quick Stats Badges */}
            <div className="hidden lg:flex items-center gap-3">
              <div 
                className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg"
                title="Early Sleeper Streak"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span className="font-semibold text-slate-200">{earlySleepStreak}d</span>
                <span className="text-slate-400 font-normal">Streak</span>
              </div>

              <div 
                className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg"
                title="Daily Task Progress"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">{todayCompletionRate}%</span>
                <span className="text-slate-400 font-normal">Tasks</span>
              </div>

              <div 
                className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg"
                title="Water Hydration Status"
              >
                <Droplet className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span className="font-semibold text-slate-200">{waterIntakeMl}ml</span>
                <span className="text-slate-400 font-normal">Hydration</span>
              </div>

              <div 
                className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1.5 rounded-lg"
                title="Study Time Today"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-200">{todayStudyMins}m</span>
                <span className="text-slate-400 font-normal">Study</span>
              </div>
            </div>

            {/* Cloud Sync Indicator */}
            <button
              onClick={onManualCloudSync}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                cloudSyncStatus === 'syncing'
                  ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300'
                  : cloudSyncStatus === 'synced'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
              title="Click to manually sync with Firebase Firestore"
            >
              {cloudSyncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span className="hidden sm:inline">Saving to Firestore...</span>
                </>
              ) : cloudSyncStatus === 'synced' ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Cloud Saved</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              )}
            </button>

            {/* User Profile Pill Button */}
            {userProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-200 transition-colors"
                title="View Profile & Credentials"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {userProfile.name ? userProfile.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline font-semibold">{userProfile.name?.split(' ')[0] || 'Profile'}</span>
              </button>
            )}

            {/* Quick Add Button & Settings Dropdown */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenQuickAdd}
                className="hidden md:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                  title="Data & Backup Options"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-slate-200 text-xs">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Cloud Database
                    </div>
                    <button
                      onClick={() => {
                        onManualCloudSync();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                      Sync to Firestore Now
                    </button>

                    <hr className="my-1 border-slate-700" />

                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Account & Profile
                    </div>
                    <button
                      onClick={() => {
                        if (onOpenProfile) onOpenProfile();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      Manage Profile
                    </button>
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        Sign Out
                      </button>
                    )}

                    <hr className="my-1 border-slate-700" />

                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      File Backup
                    </div>
                    <button
                      onClick={handleExport}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Export Data (JSON)
                    </button>

                    <label className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      Import Data (JSON)
                      <input 
                        type="file" 
                        accept=".json" 
                        onChange={handleImport} 
                        className="hidden" 
                      />
                    </label>

                    <hr className="my-1 border-slate-700" />

                    <button
                      onClick={handleReset}
                      className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                      Reset to Template
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
