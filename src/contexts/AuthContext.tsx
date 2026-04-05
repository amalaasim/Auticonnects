import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import i18n from '@/i18n';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  childName: string | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithFacebook: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState<string | null>(null);

  const refreshProfile = async () => {
    const userId = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user?.id : null;
    const activeUserId = userId || session?.user?.id || user?.id;

    if (!activeUserId) {
      setChildName(null);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('child_name, language')
      .eq('user_id', activeUserId)
      .maybeSingle();

    setChildName(data?.child_name ?? null);

    if (data?.child_name && typeof window !== 'undefined') {
      window.sessionStorage.setItem('childName', data.child_name);
    }

    if (data?.language && typeof window !== 'undefined') {
      const language = data.language === 'urdu' ? 'ur' : 'en';
      window.localStorage.setItem('app_language', language);
      i18n.changeLanguage(language);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session?.user) {
          setChildName(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    let ignore = false;

    const syncProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('child_name, language')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ignore) return;

      setChildName(data?.child_name ?? null);

      if (data?.child_name) {
        window.sessionStorage.setItem('childName', data.child_name);
      }

      if (!data?.language) return;

      const language = data.language === 'urdu' ? 'ur' : 'en';
      window.localStorage.setItem('app_language', language);
      i18n.changeLanguage(language);
    };

    syncProfile();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const signUp = async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error };
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: window.location.origin },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    childName,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
