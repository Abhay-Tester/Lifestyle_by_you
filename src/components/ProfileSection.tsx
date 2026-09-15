import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MessageSquare, 
  Mail, 
  Save, 
  Check, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Sparkles,
  LogOut,
  RefreshCw,
  Send
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';

interface ProfileSectionProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  onManualCloudSync: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userProfile,
  onUpdateProfile,
  onLogout,
  cloudSyncStatus,
  onManualCloudSync,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendPasswordReset = async () => {
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 5000);
    } catch (err: unknown) {
      setResetError((err as Error)?.message || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-2 border-indigo-400/40 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {formData.name || 'User Profile'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Firebase Verified
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {formData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onManualCloudSync}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
              title="Force sync data with Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin text-indigo-400' : 'text-emerald-400'}`} />
              <span>{cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold border border-red-500/30 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Profile Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Account & Personal Information
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your personal information, contact numbers, and Firebase security settings.
            </p>
          </div>

          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              Changes Saved & Synced!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Abhay Toriya"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Address (Firebase Auth Account)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. abhaytoriya23@gmail.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 7385302325"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. 7385302325"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* City / Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Location / City
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Maharashtra, India"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Firebase Security & Password Reset Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Firebase Password Security
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendPasswordReset}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  Send Password Reset Link
                </button>
              </div>
              {resetEmailSent && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Reset link sent to your registered email!
                </p>
              )}
              {resetError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">
                  {resetError}
                </p>
              )}
            </div>

          </div>

          {/* Bio & Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Life Vision & Daily Focus
            </label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Your focus areas and habit affirmations..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Save Action Button */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Changes will sync automatically to Firestore.
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
