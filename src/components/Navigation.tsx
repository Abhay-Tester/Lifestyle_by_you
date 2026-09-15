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
  Shield
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  userName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  userName = 'Abhay Toriya',
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainPages = [
    {
      id: 'habit_matrix' as ActiveTab,
      label: 'Habit Matrix Sheet 📊',
      sublabel: 'Routines, Habits & Multi-Date Matrix',
      icon: BarChart3,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      highlight: true,
    },
  ];

  const sideMenuOptions = [
    {
      id: 'profile' as ActiveTab,
      label: 'My Profile & Account',
      sublabel: 'Contact, Mobile & Security',
      icon: User,
      badgeLabel: 'New',
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'What is the Purchase Item?',
      sublabel: 'Budget & Wishlist',
      icon: ShoppingBag,
    },
    {
      id: 'goals' as ActiveTab,
      label: 'What is the Goal?',
      sublabel: 'Milestones & Targets',
      icon: Target,
    },
    {
      id: 'food_health' as ActiveTab,
      label: 'What is the Health Thing?',
      sublabel: 'Food, Water & Digestion',
      icon: Utensils,
    },
    {
      id: 'habit_ladder' as ActiveTab,
      label: 'Brain Comfort Ladder',
      sublabel: '3 → 6 → 11 Day System',
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
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Header Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-3 px-4 flex items-center justify-between sticky top-[61px] z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Menu Navigation
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{isMobileOpen ? 'Close Menu' : 'Open Left Panel'}</span>
        </button>
      </div>

      {/* Desktop & Mobile Left Sidebar Container */}
      <aside
        className={`fixed md:sticky top-[61px] left-0 z-20 h-[calc(100vh-61px)] w-72 bg-white border-r border-slate-200 overflow-y-auto no-scrollbar transition-transform duration-200 ease-in-out shrink-0 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-5">
          
          {/* Main Top Pages (Pages 1 & 2) */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              Core Habit Pages
            </div>

            <div className="space-y-1.5">
              {mainPages.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border ${
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

          {/* Left Panel Menu Options */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">
              Life Options & Tracking
            </div>

            <div className="space-y-1">
              {sideMenuOptions.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
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
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with User info & active status */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
          <button
            onClick={() => handleSelectTab('profile')}
            className="w-full flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="truncate min-w-0 flex-1">
              <div className="font-bold text-slate-900 text-xs truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">Account & Security</div>
            </div>
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};
