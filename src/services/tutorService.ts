import type { Tutor } from '../interfaces/tutor';
import { apiGet } from './apiClient';
import { getCurrentUserId } from './authService';

export async function getCurrentTutor(): Promise<Tutor | null> {
  const idUsuario = getCurrentUserId();
  if (idUsuario === null) return null;

  try {
    return await apiGet<Tutor>(`/api/tutores/by-usuario/${idUsuario}`);
  } catch {
    return null;
  }
}
