import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { LoginRequest, RegisterRequest, RegisterVetRequest } from '../interfaces/auth';
import { buildSession } from '../domain/session';
import { login, registerTutor, registerVeterinario } from '../services/authService';
import { ApiError } from '../services/http';
import { clearLocalUserData } from '../services/localDataCleanup';
import { useAuth } from '../providers/AuthProvider';
import { resetToWelcome } from '../navigation/navigationRef';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      let auth;
      try {
        auth = await login(data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          throw new Error('E-mail ou senha inválidos.');
        }
        throw error;
      }

      const session = buildSession(auth);
      if (!session.ok) throw new Error(session.error);
      return session.input;
    },
    onSuccess: (session) => signIn(session),
  });
}

export type RegisterInput =
  | { role: 'TUTOR'; data: RegisterRequest }
  | { role: 'VETERINARIO'; data: RegisterVetRequest };

function registerErrorMessage(error: ApiError): string | null {
  const text = error.message.toUpperCase();

  if (error.status === 409) {
    if (text.includes('CRMV')) return 'Este CRMV já está cadastrado.';
    if (text.includes('CPF')) return 'Este CPF já está cadastrado.';
    return 'Este e-mail já está cadastrado.';
  }
  if (error.status === 400) {
    return 'Dados inválidos. Confira CPF (11 dígitos), data de nascimento, CRMV e senha (mínimo de 8 caracteres).';
  }
  return null;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      try {
        return input.role === 'VETERINARIO'
          ? await registerVeterinario(input.data)
          : await registerTutor(input.data);
      } catch (error) {
        const message = error instanceof ApiError ? registerErrorMessage(error) : null;
        throw message ? new Error(message) : error;
      }
    },
  });
}

export function useLogout() {
  const { signOut } = useAuth();

  return useCallback(async () => {
    // Lembretes e planos guardados são de quem saiu: não podem continuar neste aparelho.
    await clearLocalUserData().catch(() => undefined);
    await signOut();
    resetToWelcome();
  }, [signOut]);
}
