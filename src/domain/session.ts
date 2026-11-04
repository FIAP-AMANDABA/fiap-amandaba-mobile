import type { AuthResponse, Session, UserRole } from '../interfaces/auth';
import { fail, ok, type BuildResult } from './buildResult';

const ROLES: UserRole[] = ['TUTOR', 'VETERINARIO'];

export function isUserRole(value: unknown): value is UserRole {
  return ROLES.includes(value as UserRole);
}

export function buildSession(auth: AuthResponse): BuildResult<Session> {
  if (!isUserRole(auth.perfil)) return fail('Tipo de conta não reconhecido. Entre em contato com o suporte.');

  return ok({ token: auth.token, userId: auth.idUsuario, role: auth.perfil, profileId: auth.idPerfil });
}

// Lê o `exp` do JWT sem validar a assinatura (quem valida é a API); só descarta sessões já vencidas.
export function isTokenExpired(token: string, nowMs: number): boolean {
  try {
    const payload = token.split('.')[1];
    if (!payload) return false;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
    const { exp } = JSON.parse(json) as { exp?: number };

    return typeof exp === 'number' && exp * 1000 <= nowMs;
  } catch {
    return false;
  }
}
