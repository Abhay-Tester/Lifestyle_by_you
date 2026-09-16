import { Task, DailyLog } from '../types';

export type NotificationSoundType = 'chime' | 'bell' | 'digital' | 'gentle';

export interface NotificationSettings {
  enabled: boolean;
  permissionGranted: boolean;
  soundEnabled: boolean;
  soundType: NotificationSoundType;
  soundVolume: number; // 0.1 to 1.0
  taskRemindersEnabled: boolean; // Notify for scheduled task times (e.g., 6:00 PM walk)
  wakeTimeReminder: boolean;    // Remind at target wake up time
  sleepTimeReminder: boolean;   // Remind 30m before target sleep time
  hydrationRemindersEnabled: boolean; // Remind to drink water periodically
  hydrationIntervalHours: number; // Interval in hours (default 2)
  lastUpdated?: string;
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  permissionGranted: typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
  soundEnabled: true,
  soundType: 'chime',
  soundVolume: 0.8,
  taskRemindersEnabled: true,
  wakeTimeReminder: true,
  sleepTimeReminder: true,
  hydrationRemindersEnabled: false,
  hydrationIntervalHours: 2,
};

const TRIGGERED_NOTIFS_KEY = 'lifeos_triggered_notifications';

// Helper to get triggered notification set for today
function getTodayTriggeredSet(): Set<string> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(TRIGGERED_NOTIFS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) {
      localStorage.removeItem(TRIGGERED_NOTIFS_KEY);
      return new Set();
    }
    return new Set(parsed.keys || []);
  } catch {
    return new Set();
  }
}

function markTriggeredToday(key: string) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const set = getTodayTriggeredSet();
    set.add(key);
    localStorage.setItem(TRIGGERED_NOTIFS_KEY, JSON.stringify({
      date: today,
      keys: Array.from(set)
    }));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Play synthesized notification audio using Web Audio API (extended to 4.5 - 5 seconds duration)
 */
export function playNotificationChime(type: NotificationSoundType = 'chime', volume: number = 0.8) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const vol = Math.max(0, Math.min(1, volume));

    if (type === 'bell') {
      // Tibetan Bell / Meditation Gong (4.8 seconds total sustain with two resonant strikes)
      const strikes = [0.0, 2.3];
      strikes.forEach((startTime) => {
        // Fundamental tone (A4 -> A3 decay)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime + startTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + startTime + 2.3);
        gain.gain.setValueAtTime(0.35 * vol, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 2.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + 2.3);

        // High harmonic shimmer
        const oscHarmonic = ctx.createOscillator();
        const gainHarmonic = ctx.createGain();
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(880, ctx.currentTime + startTime);
        gainHarmonic.gain.setValueAtTime(0.12 * vol, ctx.currentTime + startTime);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 1.8);
        oscHarmonic.connect(gainHarmonic);
        gainHarmonic.connect(ctx.destination);
        oscHarmonic.start(ctx.currentTime + startTime);
        oscHarmonic.stop(ctx.currentTime + startTime + 1.8);
      });
    } else if (type === 'digital') {
      // Energetic Digital Alarm (5 alarm pulse cycles across 4.5 seconds)
      const pulseDelays = [0.0, 0.9, 1.8, 2.7, 3.6];
      pulseDelays.forEach((pulseStart) => {
        [0.0, 0.14].forEach((subOffset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(960, ctx.currentTime + pulseStart + subOffset);
          gain.gain.setValueAtTime(0.14 * vol, ctx.currentTime + pulseStart + subOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + pulseStart + subOffset + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + pulseStart + subOffset);
          osc.stop(ctx.currentTime + pulseStart + subOffset + 0.1);
        });
      });
    } else if (type === 'gentle') {
      // Gentle Harmonic Marimba (3 repeating chord loops over 4.5 seconds)
      const loops = [0.0, 1.5, 3.0];
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      loops.forEach((loopStart) => {
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + loopStart + idx * 0.12);
          gain.gain.setValueAtTime(0.22 * vol, ctx.currentTime + loopStart + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + loopStart + idx * 0.12 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + loopStart + idx * 0.12);
          osc.stop(ctx.currentTime + loopStart + idx * 0.12 + 0.6);
        });
      });
    } else {
      // Default: Soft Dual Crystal Chime (5 chime cycles over 4.5 seconds)
      const chimeDelays = [0.0, 0.9, 1.8, 2.7, 3.6];
      chimeDelays.forEach((delay) => {
        // First tone (G5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + delay);
        gain1.gain.setValueAtTime(0.18 * vol, ctx.currentTime + delay);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(ctx.currentTime + delay);
        osc1.stop(ctx.currentTime + delay + 0.35);

        // Second tone (C6 chime)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + delay + 0.14);
        gain2.gain.setValueAtTime(0.22 * vol, ctx.currentTime + delay + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.55);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + delay + 0.14);
        osc2.stop(ctx.currentTime + delay + 0.55);
      });
    }
  } catch {
    // Web audio playback fallback ignore
  }
}

/**
 * Check browser notification permission status
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request permission from browser / mobile user for Push & System Notifications
 */
export async function requestNotificationPermission(settings?: NotificationSettings): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('Web Notifications are not supported in this browser version.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      playNotificationChime(settings?.soundType, settings?.soundVolume);
      triggerSystemNotification(
        '🔔 Notifications Activated!',
        'You will now receive timely reminders for your tasks, wake up time, and sleep schedule.',
        { soundType: settings?.soundType, soundVolume: settings?.soundVolume }
      );
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Show system notification or dispatch in-app notification event
 */
export function triggerSystemNotification(
  title: string, 
  body: string, 
  options?: { tag?: string; icon?: string; soundEnabled?: boolean; soundType?: NotificationSoundType; soundVolume?: number }
) {
  // Play chime if enabled
  if (options?.soundEnabled !== false) {
    playNotificationChime(options?.soundType || 'chime', options?.soundVolume ?? 0.8);
  }

  // Dispatch custom event for in-app alert banner
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lifeos:in-app-notification', {
        detail: { title, body, timestamp: new Date().toISOString() }
      })
    );
  }

  // If system notifications are granted, trigger native notification
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: options?.icon || '/favicon.ico',
        tag: options?.tag || 'lifeos-reminder',
        requireInteraction: true,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch {
      // Fallback if Service Worker is required on mobile browsers
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: options?.icon || '/favicon.ico',
            tag: options?.tag || 'lifeos-reminder',
          });
        }).catch(() => {});
      }
    }
  }
}

/**
 * Run scheduler ticker to evaluate scheduled task times, wake times, and sleep times
 */
export function evaluateScheduledReminders(
  tasks: Task[],
  dailyLog: DailyLog | undefined,
  settings: NotificationSettings
) {
  if (!settings.enabled) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${hours}:${minutes}`; // e.g. "18:00"
  const todayDateStr = now.toISOString().slice(0, 10);

  const triggeredSet = getTodayTriggeredSet();

  const soundOpts = {
    soundEnabled: settings.soundEnabled,
    soundType: settings.soundType,
    soundVolume: settings.soundVolume,
  };

  // 1. Task Reminders (e.g. 6:00 PM walk, study session)
  if (settings.taskRemindersEnabled) {
    tasks.forEach((task) => {
      // Check if task has a scheduled time or explicit reminder time matching current minute
      const targetTime = task.reminderTime || task.scheduledTime;
      if (!targetTime) return;

      const isCompletedToday = task.completedDates[todayDateStr];
      if (isCompletedToday) return; // don't notify completed tasks

      const triggerKey = `task_${task.id}_${todayDateStr}_${targetTime}`;

      if (targetTime === currentTimeStr && !triggeredSet.has(triggerKey)) {
        markTriggeredToday(triggerKey);
        triggerSystemNotification(
          'Alert',
          `Alert :- ${task.title}`,
          { tag: `task-${task.id}`, ...soundOpts }
        );
      }
    });
  }

  // 2. Wake Up Time Reminder (e.g. 06:00 AM)
  if (settings.wakeTimeReminder && dailyLog?.targetWakeTime) {
    const wakeTime = dailyLog.targetWakeTime;
    const triggerKey = `wake_${todayDateStr}_${wakeTime}`;

    if (wakeTime === currentTimeStr && !triggeredSet.has(triggerKey)) {
      markTriggeredToday(triggerKey);
      triggerSystemNotification(
        '☀️ Good Morning! Wake Up Routine',
        `It's ${formatTime12Hour(wakeTime)}. Time to get up, hydrate, and start your day!`,
        { tag: 'wake-reminder', ...soundOpts }
      );
    }
  }

  // 3. Sleep Wind-down Reminder (e.g. 30 mins before target sleep time)
  if (settings.sleepTimeReminder && dailyLog?.targetSleepTime) {
    const sleepTime = dailyLog.targetSleepTime; // e.g., "22:00"
    const windDownTime = calculateSubtractedTime(sleepTime, 30); // e.g., "21:30"
    const triggerKey = `sleep_${todayDateStr}_${windDownTime}`;

    if (windDownTime === currentTimeStr && !triggeredSet.has(triggerKey)) {
      markTriggeredToday(triggerKey);
      triggerSystemNotification(
        '🌙 Wind-down Sleep Reminder',
        `Target sleep is ${formatTime12Hour(sleepTime)}. Time to dim screens and prepare for high-quality sleep!`,
        { tag: 'sleep-reminder', ...soundOpts }
      );
    }
  }

  // 4. Hydration Reminders
  if (settings.hydrationRemindersEnabled && settings.hydrationIntervalHours > 0) {
    const currentHour = now.getHours();
    if (currentHour >= 8 && currentHour <= 21 && now.getMinutes() === 0) {
      if (currentHour % settings.hydrationIntervalHours === 0) {
        const triggerKey = `hydration_${todayDateStr}_${currentHour}`;
        if (!triggeredSet.has(triggerKey)) {
          markTriggeredToday(triggerKey);
          triggerSystemNotification(
            '💧 Hydration Check',
            'Time to drink a glass of water and reach your daily hydration target!',
            { tag: 'hydration-reminder', ...soundOpts }
          );
        }
      }
    }
  }
}

/**
 * Format HH:mm string to 12-hour format with AM/PM (e.g., "18:00" -> "6:00 PM")
 */
export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  return `${h}:${m} ${ampm}`;
}

/**
 * Subtract minutes from HH:mm time string
 */
function calculateSubtractedTime(timeStr: string, minutesToSubtract: number): string {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  let totalMins = h * 60 + m - minutesToSubtract;
  if (totalMins < 0) totalMins += 24 * 60;

  const finalH = String(Math.floor(totalMins / 60)).padStart(2, '0');
  const finalM = String(totalMins % 60).padStart(2, '0');
  return `${finalH}:${finalM}`;
}
