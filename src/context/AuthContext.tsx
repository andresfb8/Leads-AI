import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/src/lib/firebase';
import { Business, MOCK_BUSINESSES } from '@/src/data/mock';
import { businessService } from '@/src/services/dataService';

interface AuthContextValue {
  user: User | null;
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
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      setUser(fbUser);
      if (fbUser) {
        await loadBusinesses();
      } else {
        setBusinesses(MOCK_BUSINESSES);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadBusinesses = async () => {
    try {
      let biz = await businessService.fetchAll();
      if (biz.length === 0) {
        // First login: create two default businesses
        const [b1, b2] = await Promise.all([
          businessService.create('Mi Negocio Principal', 'Owner'),
          businessService.create('Negocio Secundario', 'Partner'),
        ]);
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (err: any) {
      return friendlyError(err.code);
    }
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return null;
    } catch (err: any) {
      return friendlyError(err.code);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google sign-in error:', err.code);
    }
  };

  const signOut = async () => {
    if (isFirebaseConfigured) await firebaseSignOut(auth);
    setUser(null);
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

// ─── Human-readable Firebase error codes ─────────────────────────────────────

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found':       'No existe una cuenta con ese correo.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/email-already-in-use': 'Ese correo ya tiene una cuenta. Inicia sesión.',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':        'El formato del correo no es válido.',
    'auth/too-many-requests':    'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed': 'Error de red. Comprueba tu conexión.',
    'auth/popup-closed-by-user': 'La ventana de Google fue cerrada.',
  };
  return map[code] ?? `Error inesperado (${code}).`;
}
