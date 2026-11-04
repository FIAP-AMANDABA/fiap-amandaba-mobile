import type { UserRole } from '../interfaces/auth';
import type { RelatorioPet } from '../interfaces/relatorio';
import { httpRequest } from './http';
import { JAVA_API_BASE_URL } from './javaApi';

export function getRelatorio(role: UserRole): Promise<RelatorioPet[]> {
  const path = role === 'VETERINARIO' ? '/api/relatorios/veterinario/me' : '/api/relatorios/tutor/me';
  return httpRequest<RelatorioPet[]>(JAVA_API_BASE_URL, 'GET', path);
}
