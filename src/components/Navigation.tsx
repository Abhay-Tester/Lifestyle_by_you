import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  BarChart3,
  Moon, 
  BookOpen, 
  Utensils, 
  Target, 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight,
  Brain,
  User,
  Shield,
  FileText
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  userName?: string;
  emergencyNotesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  userName = 'Abhay Toriya',
  emergencyNotesCount = 0,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainPages = [
    {
      id: 'habit_matrix' as ActiveTab,
      label: 'Habit Matrix 📊',
      sublabel: 'Routines, Habits & Multi-Date Matrix',
      icon: BarChart3,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      highlight: true,
    },
  ];

  // Placed 'notes' in the options list and 'profile' at the very last of the side menu options
  const sideMenuOptions = [
    {
      id: 'notes' as ActiveTab,
      label: 'Notes',
      sublabel: 'Quick Thoughts & Logs',
      icon: FileText,
      badge: emergencyNotesCount > 0 ? emergencyNotesCount : null,
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'Purchase Planner',
      sublabel: 'Budget & Wishlist',
      icon: ShoppingBag,
    },
    {
      id: 'goals' as ActiveTab,
      label: 'Life Goals',
      sublabel: 'Milestones & Targets',
      icon: Target,
    },
    {
      id: 'food_health' as ActiveTab,
      label: 'Food & Health Log',
      sublabel: 'Food, Water & Digestion',
      icon: Utensils,
    },
    {
      id: 'habit_ladder' as ActiveTab,
      label: 'Brain Comfort Ladder',
      sublabel: 'Habit Building System',
      icon: Brain,
    },
    {
      id: 'study_exercise' as ActiveTab,
      label: 'Study & Exercise Logs',
      sublabel: 'Focus & Fitness',
      icon: BookOpen,
    },
    {
      id: 'wake_sleep' as ActiveTab,
      label: 'Wake & Sleep Routine',
      sublabel: 'Circadian Schedule',
      icon: Moon,
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Streaks',
      sublabel: 'Performance Overview',
      icon: BarChart3,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'My Profile & Account',
      sublabel: 'Personal Details & Security',
      icon: User,
      badgeLabel: 'Account',
    },
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Bar with Quick Tabs & Menu Toggle */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 sm:top-[61px] z-30 shadow-xs">
        <div className="p-2 px-3 flex items-center justify-between border-b border-slate-100 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              ⚡
            </div>
            <span className="font-extrabold text-slate-900 text-xs truncate">
              {mainPages.find(p => p.id === activeTab)?.label || sideMenuOptions.find(o => o.id === activeTab)?.label || 'Workspace'}
            </span>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shrink-0 cursor-pointer"
          >
            {isMobileOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>{isMobileOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>

        {/* Scrollable Quick Tabs on Phone */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar bg-slate-50/70">
          <button
            onClick={() => handleSelectTab('habit_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'habit_matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Habit Matrix</span>
            {pendingTasksCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'habit_matrix' ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
              }`}>
                {pendingTasksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
            {emergencyNotesCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'notes' ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {emergencyNotesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleSelectTab('goals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'goals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Goals</span>
          </button>

          <button
            onClick={() => handleSelectTab('purchases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'purchases'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Purchases</span>
          </button>

          <button
            onClick={() => handleSelectTab('food_health')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'food_health'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Health & Meals</span>
          </button>

          <button
            onClick={() => handleSelectTab('habit_ladder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'habit_ladder'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Ladder</span>
          </button>

          <button
            onClick={() => handleSelectTab('study_exercise')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'study_exercise'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study & Fitness</span>
          </button>

          <button
            onClick={() => handleSelectTab('wake_sleep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wake_sleep'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Sleep</span>
          </button>

          <button
            onClick={() => handleSelectTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-20 md:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Desktop & Mobile Left Sidebar Container */}
      <aside
        className={`fixed md:sticky top-[61px] left-0 z-30 md:z-20 h-[calc(100vh-61px)] w-72 bg-white border-r border-slate-200 overflow-y-auto no-scrollbar transition-transform duration-200 ease-in-out shrink-0 flex flex-col justify-between shadow-xl md:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4">
          
          {/* Main Core Habit Page */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              Primary Workspace
            </div>

            <div className="space-y-1">
              {mainPages.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-indigo-50/50 hover:bg-indigo-50 text-indigo-950 border-indigo-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {tab.label}
                        </div>
                        <div className={`text-[10px] ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {tab.sublabel}
                        </div>
                      </div>
                    </div>

                    {tab.badge !== null ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Left Panel Menu Options (with Emergency Notes included and Profile last) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              Life Options & Tracking
            </div>

            <div className="space-y-1">
              {sideMenuOptions.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isProfile = tab.id === 'profile';
                const isNotes = tab.id === 'notes';

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : isNotes
                        ? 'text-slate-800 bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100 font-medium'
                        : isProfile
                        ? 'text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${
                        isActive 
                          ? 'text-indigo-400' 
                          : isNotes
                          ? 'text-indigo-600'
                          : isProfile 
                          ? 'text-indigo-600' 
                          : 'text-slate-500'
                      }`} />
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          <span>{tab.label}</span>
                          {tab.badgeLabel && !isActive && (
                            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">
                              {tab.badgeLabel}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                          {tab.sublabel}
                        </div>
                      </div>
                    </div>

                    {tab.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shrink-0 ml-1">
                        {tab.badge}
                      </span>
                    ) : isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-2" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with User Card quick trigger */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
          <button
            onClick={() => handleSelectTab('profile')}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-left transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-xs truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">Tap to edit profile</div>
            </div>
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};
