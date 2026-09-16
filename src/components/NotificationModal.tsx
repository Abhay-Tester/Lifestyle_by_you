import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  Clock, 
  Moon, 
  Sun, 
  Droplets,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Play,
  Music
} from 'lucide-react';
import { 
  NotificationSettings, 
  NotificationSoundType,
  requestNotificationPermission, 
  getNotificationPermissionStatus, 
  triggerSystemNotification,
  playNotificationChime
} from '../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermissionStatus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission(settings);
    const currentStatus = getNotificationPermissionStatus();
    setPermission(currentStatus);
    onUpdateSettings({
      ...settings,
      enabled: granted,
      permissionGranted: granted,
    });
  };

  const handleTestNotification = () => {
    triggerSystemNotification(
      'Alert',
      'Alert :- Morning Walk & Meditation',
      {
        soundEnabled: settings.soundEnabled,
        soundType: settings.soundType,
        soundVolume: settings.soundVolume,
      }
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSoundTypeChange = (soundType: NotificationSoundType) => {
    onUpdateSettings({ ...settings, soundType });
    playNotificationChime(soundType, settings.soundVolume);
  };

  const handleVolumeChange = (v: number) => {
    onUpdateSettings({ ...settings, soundVolume: v });
  };

  const soundOptions: { id: NotificationSoundType; name: string; desc: string }[] = [
    { id: 'chime', name: 'Crystal Chime', desc: 'Soft dual-frequency crystal chime' },
    { id: 'bell', name: 'Tibetan Bell / Gong', desc: 'Deep soothing resonance' },
    { id: 'gentle', name: 'Marimba Arpeggio', desc: 'Harmonic 3-note melody' },
    { id: 'digital', name: 'Digital Alarm Beep', desc: 'High-visibility energetic tone' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Notification & Alert Center</h2>
              <p className="text-xs text-indigo-200">Phone alerts for tasks, wake-up & sleep schedules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Device & Phone Notification Status Banner */}
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Browser & Mobile Phone Status</h3>
                  <p className="text-xs text-slate-500">
                    {permission === 'granted'
                      ? 'Notifications are ACTIVE. Alerts will pop up on your device.'
                      : permission === 'denied'
                      ? 'Blocked in browser settings. Please allow notifications in site permissions.'
                      : 'Permission required to pop alerts on phone & screen.'}
                  </p>
                </div>
              </div>

              {permission === 'granted' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" /> Action Needed
                </span>
              )}
            </div>

            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                onClick={handleRequestPermission}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                Enable System & Phone Notifications
              </button>
            )}

            {permission === 'granted' && (
              <button
                onClick={handleTestNotification}
                className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  testSent
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                }`}
              >
                {testSent ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Test Notification Sent! Check your device.
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Send Test Notification Now
                  </>
                )}
              </button>
            )}
          </div>

          {/* Master Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Master Notification Switch</span>
                <span className="text-[11px] text-slate-500 block">Turn all automatic scheduled reminders on or off</span>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('enabled')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.enabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Specific Notification Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Scheduled Routine Channels</h4>

            {/* 1. Task Reminders */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Task Time Reminders</span>
                  <span className="text-[11px] text-slate-500 block">Alerts at scheduled task times (e.g. Walk at 6:00 PM)</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('taskRemindersEnabled')}
                disabled={!settings.enabled}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.taskRemindersEnabled && settings.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                    settings.taskRemindersEnabled && settings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 2. Wake Up Routine */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Wake Up Morning Alarm</span>
                  <span className="text-[11px] text-slate-500 block">Notify at your daily target wake-up time</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('wakeTimeReminder')}
                disabled={!settings.enabled}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.wakeTimeReminder && settings.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                    settings.wakeTimeReminder && settings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 3. Sleep Wind-down */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-purple-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Sleep Wind-Down Reminder</span>
                  <span className="text-[11px] text-slate-500 block">Notify 30 mins before target sleep time</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('sleepTimeReminder')}
                disabled={!settings.enabled}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.sleepTimeReminder && settings.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                    settings.sleepTimeReminder && settings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 4. Hydration Check */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-cyan-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Hydration Reminders</span>
                  <span className="text-[11px] text-slate-500 block">Remind to drink water every 2 hours</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('hydrationRemindersEnabled')}
                disabled={!settings.enabled}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.hydrationRemindersEnabled && settings.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                    settings.hydrationRemindersEnabled && settings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 5. Audio Sound & Ringtone Settings */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3.5 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Notification Sound & Alarm</span>
                    <span className="text-[11px] text-slate-500 block">Play sound chime when alerts trigger</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('soundEnabled')}
                  disabled={!settings.enabled}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.soundEnabled && settings.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                      settings.soundEnabled && settings.enabled ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {settings.soundEnabled && settings.enabled && (
                <div className="pt-2 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                  {/* Tone presets grid */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Music className="w-3 h-3 text-indigo-600" /> Select Ringtone Melody</span>
                      <button 
                        onClick={() => playNotificationChime(settings.soundType, settings.soundVolume)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-indigo-600" /> Play Selected Sound
                      </button>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {soundOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSoundTypeChange(opt.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                            settings.soundType === opt.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{opt.name}</span>
                            <span className={`text-[10px] block truncate ${settings.soundType === opt.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {opt.desc}
                            </span>
                          </div>
                          {settings.soundType === opt.id && (
                            <Check className="w-4 h-4 shrink-0 text-amber-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-slate-500" /> Alert Sound Volume
                      </span>
                      <span className="text-[11px] font-extrabold text-indigo-600">
                        {Math.round(settings.soundVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={settings.soundVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
          >
            Done & Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
