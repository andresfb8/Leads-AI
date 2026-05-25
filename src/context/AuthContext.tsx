import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { Business, MOCK_BUSINESSES } from '@/src/data/mock';
import { businessService } from '@/src/services/dataService';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  businesses: Business[];
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadBusinesses();
      else setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadBusinesses();
      } else {
        setBusinesses(MOCK_BUSINESSES);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadBusinesses = async () => {
    try {
      let biz = await businessService.fetchAll();
      if (biz.length === 0) {
        // First login: seed two default businesses
        const b1 = await businessService.create('Mi Negocio Principal', 'Owner');
        const b2 = await businessService.create('Negocio Secundario', 'Partner');
        biz = [b1, b2];
      }
      setBusinesses(biz);
    } catch (err) {
      console.error('Failed to load businesses:', err);
      setBusinesses(MOCK_BUSINESSES);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error?.message ?? null;
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    setBusinesses(MOCK_BUSINESSES);
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setBusinesses(MOCK_BUSINESSES);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        businesses,
        isLoading,
        isDemoMode,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
