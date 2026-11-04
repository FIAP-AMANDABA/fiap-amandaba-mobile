import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '../interfaces/auth';

const SESSION_KEY = 'amandaba:session';
const LEGACY_USER_ID_KEY = 'amandaba:currentUserId';

function isSession(value: unknown): value is Session {
  const candidate = value as Partial<Session> | null;
  // Sessões antigas (sem `role`) são descartadas: o usuário entra de novo.
  return (
    typeof candidate?.token === 'string' &&
    (candidate.role === 'TUTOR' || candidate.role === 'VETERINARIO') &&
    Number.isFinite(candidate.userId) &&
    Number.isFinite(candidate.profileId)
  );
}

export async function loadSavedSession(): Promise<Session | null> {
  await AsyncStorage.removeItem(LEGACY_USER_ID_KEY);

  const stored = await AsyncStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSavedSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
