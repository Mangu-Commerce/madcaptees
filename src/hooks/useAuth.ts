import { useState, useEffect, useCallback } from 'react';
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Profile } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    isAdmin: false,
  });

  const loadProfile = useCallback(async (userId: string) => {
    if (!hasSupabaseConfig) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('loadProfile error:', error);
      return null;
    }

    return data as Profile;
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      const profile = session?.user
        ? await loadProfile(session.user.id)
        : null;
      setState({
        user: session?.user ?? null,
        session,
        profile,
        loading: false,
        isAdmin: profile?.is_admin ?? false,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const profile = session?.user
        ? await loadProfile(session.user.id)
        : null;
      setState({
        user: session?.user ?? null,
        session,
        profile,
        loading: false,
        isAdmin: profile?.is_admin ?? false,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!hasSupabaseConfig) {
      throw new Error('Supabase is not configured. Add keys to .env.local');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    if (!hasSupabaseConfig) {
      throw new Error('Supabase is not configured. Add keys to .env.local');
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!hasSupabaseConfig) return;
    await supabase.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}
