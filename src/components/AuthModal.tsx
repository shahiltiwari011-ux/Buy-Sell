import React, { useState } from 'react';
import { useAuth } from '../services/authService';
import { X, Mail, Lock, User, GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle2, LogIn, UserPlus, KeyRound } from 'lucide-react';

type AuthView = 'sign-in' | 'sign-up' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [view, setView] = useState<AuthView>('sign-in');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('Delhi University');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setCollege('Delhi University');
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
  };

  const switchView = (v: AuthView) => {
    resetForm();
    setView(v);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);
    if (error) {
      setErrorMsg(error);
    } else {
      resetForm();
      onClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!email.trim()) { setErrorMsg('Please enter your email.'); return; }
    if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }

    setIsSubmitting(true);
    const { error } = await signUp(email.trim(), password, fullName.trim(), college);
    setIsSubmitting(false);
    if (error) {
      setErrorMsg(error);
    } else {
      setSuccessMsg('Account created! Check your email for a confirmation link.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) { setErrorMsg('Please enter your email address.'); return; }
    setIsSubmitting(true);
    const { error } = await resetPassword(email.trim());
    setIsSubmitting(false);
    if (error) {
      setErrorMsg(error);
    } else {
      setSuccessMsg('Password reset link sent! Check your inbox.');
    }
  };

  const titles: Record<AuthView, string> = {
    'sign-in': 'Welcome back',
    'sign-up': 'Join campusloop',
    'forgot-password': 'Reset password',
  };

  const subtitles: Record<AuthView, string> = {
    'sign-in': 'Sign in to buy, sell & find roommates',
    'sign-up': 'Create your student account',
    'forgot-password': 'We\'ll email you a reset link',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white hover:bg-slate-100 border-2 border-black flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-7 pb-5 bg-[#FCFBF7] border-b-2 border-black">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E2F952] border-2 border-black flex items-center justify-center text-black">
              {view === 'sign-in' ? <LogIn className="w-5 h-5" /> :
               view === 'sign-up' ? <UserPlus className="w-5 h-5" /> :
               <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{titles[view]}</h3>
              <p className="text-xs text-slate-500 font-medium">{subtitles[view]}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={view === 'sign-in' ? handleSignIn : view === 'sign-up' ? handleSignUp : handleForgotPassword}
          className="p-6 space-y-4"
        >
          {/* Success Message */}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name (sign-up only) */}
          {view === 'sign-up' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* College (sign-up only) */}
          {view === 'sign-up' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                College
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium bg-white text-slate-900 focus:outline-none"
                >
                  <option>Delhi University</option>
                  <option>IIT Delhi</option>
                  <option>JNU</option>
                  <option>NID</option>
                  <option>IP University</option>
                  <option>Ashoka University</option>
                  <option>BITS Pilani</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
              Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password (not for forgot-password) */}
          {view !== 'forgot-password' && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={view === 'sign-up' ? 'At least 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-black text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-50"
                  autoComplete={view === 'sign-up' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot password link (sign-in) */}
          {view === 'sign-in' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchView('forgot-password')}
                className="text-xs font-bold text-slate-500 hover:text-black hover:underline cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !!successMsg}
            className="w-full py-3 px-4 rounded-2xl font-black text-sm text-black bg-[#E2F952] hover:bg-[#d5ee40] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Loading...</span>
            ) : view === 'sign-in' ? (
              <><LogIn className="w-4 h-4" /> Sign In</>
            ) : view === 'sign-up' ? (
              <><UserPlus className="w-4 h-4" /> Create Account</>
            ) : (
              <><KeyRound className="w-4 h-4" /> Send Reset Link</>
            )}
          </button>

          {/* Toggle between views */}
          <div className="text-center text-xs text-slate-500 font-medium pt-1">
            {view === 'sign-in' && (
              <>
                Don't have an account?{' '}
                <button type="button" onClick={() => switchView('sign-up')} className="font-black text-black hover:underline cursor-pointer">
                  Sign Up
                </button>
              </>
            )}
            {view === 'sign-up' && (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => switchView('sign-in')} className="font-black text-black hover:underline cursor-pointer">
                  Sign In
                </button>
              </>
            )}
            {view === 'forgot-password' && (
              <button type="button" onClick={() => switchView('sign-in')} className="font-black text-black hover:underline cursor-pointer">
                ← Back to Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
