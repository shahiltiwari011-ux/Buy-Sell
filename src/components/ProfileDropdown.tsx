import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../services/authService';
import { LogOut, User, Settings, ShieldCheck, LogIn, AlertCircle } from 'lucide-react';

interface ProfileDropdownProps {
  onOpenAuth: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onOpenAuth }) => {
  const { isAuthenticated, isDemoMode, user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarUrl = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Student';

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!isAuthenticated && !isDemoMode) {
    // Show sign-in button when not authenticated and Supabase is configured
    return (
      <button
        onClick={onOpenAuth}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 border border-black/20 transition-colors cursor-pointer"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer focus:outline-none"
        title={isAuthenticated ? `Signed in as ${displayName}` : 'Demo Mode (not signed in)'}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#E2F952] ring-2 ring-black overflow-hidden bg-amber-100 flex items-center justify-center">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80';
            }}
          />
        </div>
        {/* Online indicator */}
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${isAuthenticated ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
          {/* User Info Header */}
          <div className="px-4 py-3.5 bg-[#FCFBF7] border-b-2 border-black/10">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-xl object-cover border-2 border-black"
              />
              <div className="min-w-0 flex-1">
                <div className="font-black text-sm text-slate-900 truncate flex items-center gap-1">
                  {displayName}
                  {isAuthenticated && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  {isAuthenticated ? user?.email : 'Demo Mode'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1.5">
            {isDemoMode && (
              <div className="px-4 py-2.5 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border-b border-amber-100">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-medium">
                  Demo Mode — data is saved in your browser only.{' '}
                  <button
                    onClick={() => { setIsOpen(false); onOpenAuth(); }}
                    className="font-black text-black hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>{' '}
                  to save to the cloud.
                </span>
              </div>
            )}

            {isAuthenticated && (
              <>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </button>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </button>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors border-t border-slate-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : !isDemoMode ? (
              <button
                onClick={() => { setIsOpen(false); onOpenAuth(); }}
                className="w-full px-4 py-2.5 text-left text-sm font-bold text-black hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
