import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  college: string;
  student_id_status: 'unverified' | 'pending' | 'verified';
  bio: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string, college: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'college' | 'bio' | 'phone'>>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------------------------------------------------------
// Provider
// -------------------------------------------------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured();

  // Fetch the user's profile row from `profiles` table
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.warn('[Auth] Profile fetch error:', error.message);
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.warn('[Auth] Profile fetch exception:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  }, [user, fetchProfile]);

  // Bootstrap: listen for auth state changes
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    // Listen for changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          const p = await fetchProfile(newSession.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // -------------------------------------------------------------------
  // Auth Actions
  // -------------------------------------------------------------------
  const signUp = async (email: string, password: string, fullName: string, college: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured. Running in demo mode.' };
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, college },
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured. Running in demo mode.' };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Sign in failed' };
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Password reset failed' };
    }
  };

  const updateProfile = async (
    updates: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'college' | 'bio' | 'phone'>>
  ): Promise<{ error: string | null }> => {
    if (!supabase || !user) return { error: 'Not authenticated' };
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) return { error: error.message };
      await refreshProfile();
      return { error: null };
    } catch (err: unknown) {
      return { error: (err as Error).message || 'Profile update failed' };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    isDemoMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -------------------------------------------------------------------
// Hook
// -------------------------------------------------------------------
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
