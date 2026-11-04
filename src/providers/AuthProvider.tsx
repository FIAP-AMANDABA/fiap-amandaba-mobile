import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session, UserRole } from '../interfaces/auth';
import { isTokenExpired } from '../domain/session';
import { setAuthToken } from '../services/authToken';
import { clearSavedSession, loadSavedSession, saveSession } from '../services/sessionStorage';

interface AuthContextValue {
  userId: number | null;
  role: UserRole | null;
  tutorId: number | null;
  veterinarioId: number | null;
  restored: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    loadSavedSession()
      .then(async (saved) => {
        if (saved && isTokenExpired(saved.token, Date.now())) {
          await clearSavedSession();
          return;
        }
        if (saved) {
          // O token precisa estar disponível ao cliente HTTP antes da primeira consulta.
          setAuthToken(saved.token);
          setSession(saved);
        }
      })
      .catch(() => undefined)
      .finally(() => setRestored(true));
  }, []);

  const signIn = useCallback(async (next: Session) => {
    setAuthToken(next.token);
    await saveSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    await clearSavedSession();
    queryClient.clear();
    setSession(null);
  }, [queryClient]);

  const value = useMemo(
    () => ({
      userId: session?.userId ?? null,
      role: session?.role ?? null,
      tutorId: session?.role === 'TUTOR' ? session.profileId : null,
      veterinarioId: session?.role === 'VETERINARIO' ? session.profileId : null,
      restored,
      signIn,
      signOut,
    }),
    [session, restored, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
