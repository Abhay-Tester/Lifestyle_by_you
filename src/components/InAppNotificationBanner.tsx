import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Sparkles } from 'lucide-react';

interface NotifDetail {
  title: string;
  body: string;
  timestamp: string;
}

export const InAppNotificationBanner: React.FC = () => {
  const [activeNotif, setActiveNotif] = useState<NotifDetail | null>(null);

  useEffect(() => {
    const handleInAppNotif = (event: Event) => {
      const customEvent = event as CustomEvent<NotifDetail>;
      if (customEvent.detail) {
        setActiveNotif(customEvent.detail);
      }
    };

    window.addEventListener('lifeos:in-app-notification', handleInAppNotif);
    return () => {
      window.removeEventListener('lifeos:in-app-notification', handleInAppNotif);
    };
  }, []);

  if (!activeNotif) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/30 flex items-start gap-3 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="p-2.5 rounded-xl bg-indigo-600 text-amber-300 shrink-0 shadow-xs">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
            <Sparkles className="w-3 h-3 text-amber-400" /> Reminder Alert
          </div>
          <h4 className="text-sm font-bold text-white truncate mt-0.5">{activeNotif.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-snug">{activeNotif.body}</p>
        </div>

        <button
          onClick={() => setActiveNotif(null)}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
