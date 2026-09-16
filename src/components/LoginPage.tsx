import React, { useState } from 'react';
import { 
  KeyRound, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Mail,
  LogIn,
  CheckCircle2,
  Shield,
  Send
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LoginPageProps {
  onSuccessLogin: (userEmail?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessLogin,
}) => {
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Clean empty inputs by default (no prefilled values)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Firebase Email/Password Sign-In
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    // Forgot Password Flow
    if (isForgotMode) {
      if (!cleanEmail) {
        setErrorMsg('Please enter your registered email address.');
        setIsSubmitting(false);
        return;
      }
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        setInfoMsg(`Password reset link sent to ${cleanEmail}. Please check your inbox.`);
      } catch (err: unknown) {
        console.warn('Password reset error:', err);
        const errorCode = (err as { code?: string })?.code || '';
        if (errorCode === 'auth/user-not-found') {
          setErrorMsg('No user account found matching this email address.');
        } else if (errorCode === 'auth/invalid-email') {
          setErrorMsg('Please enter a valid email address.');
        } else {
          setErrorMsg('Unable to send password reset email. Please verify your email.');
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      // Direct Firebase User Sign In
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      onSuccessLogin(credential.user.email || cleanEmail);
    } catch (err: unknown) {
      console.warn('Firebase Auth error:', err);
      const errorCode = (err as { code?: string })?.code || '';
      
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      } else if (errorCode === 'auth/user-not-found') {
        setErrorMsg('No user account found matching this email address.');
      } else if (errorCode === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else if (errorCode === 'auth/too-many-requests') {
        setErrorMsg('Access temporarily blocked due to multiple failed attempts. Try again in a few minutes or reset password.');
      } else {
        setErrorMsg((err as Error)?.message || 'Authentication error. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="p-7 pb-6 text-center border-b border-slate-800/80 bg-gradient-to-b from-slate-850 to-slate-900">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-2xl shadow-lg mb-3">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            Life style
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Firebase Auth
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isForgotMode 
              ? 'Reset your account password'
              : 'Sign in to access your personal system'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 pt-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-950/70 border border-red-800/90 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800/90 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="leading-relaxed">{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address - Clean empty field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 font-medium"
              />
            </div>

            {/* Password Field (hidden in Forgot Password mode) */}
            {!isForgotMode && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(true); setErrorMsg(''); setInfoMsg(''); }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating with Firebase...</span>
              ) : isForgotMode ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Password Reset Link</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Sign In button when in Forgot Password mode */}
            {isForgotMode && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotMode(false); setErrorMsg(''); setInfoMsg(''); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

          </form>

          {/* Footer Firebase info */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by <strong>Firebase Authentication</strong></span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Database: <span className="font-mono text-slate-400">lifestylebyyou</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
