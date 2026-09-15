import React, { useState } from 'react';
import { 
  Lock, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onSuccessLogin: () => void;
  userProfile: UserProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onSuccessLogin,
  userProfile,
}) => {
  const [phone, setPhone] = useState('7385302325');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanInputPhone = phone.trim().replace(/\D/g, '');
    const cleanProfilePhone = (userProfile.phone || '7385302325').trim().replace(/\D/g, '');
    const validPassword = userProfile.password || 'Abhay@123';

    setTimeout(() => {
      // Validate credentials
      const phoneMatches = cleanInputPhone === cleanProfilePhone || cleanInputPhone.endsWith(cleanProfilePhone) || cleanProfilePhone.endsWith(cleanInputPhone);
      const passwordMatches = password === validPassword;

      if (phoneMatches && passwordMatches) {
        onSuccessLogin();
      } else {
        setErrorMsg('Invalid mobile number or password. Please verify your credentials.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleUsePreset = () => {
    setPhone('7385302325');
    setPassword('Abhay@123');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Top Header Graphic */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-2xl shadow-inner">
              🔒
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Life style Sign In
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Protected
                </span>
              </h2>
              <p className="text-xs text-slate-300">Enter your phone number & password to access your system</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick preset filler badge */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xs text-indigo-950">
              <div className="font-semibold flex items-center gap-1.5 text-indigo-800">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Default Credentials
              </div>
              <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                7385302325 ••••••••
              </div>
            </div>
            <button
              type="button"
              onClick={handleUsePreset}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 7385302325"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Verifying & Opening...</span>
            ) : (
              <>
                <span>Sign In & Open System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-400">
              Synced with Cloud Firestore and local profile security
            </span>
          </div>

        </form>

      </div>
    </div>
  );
};
