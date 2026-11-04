import type { CreateExameInput, Exame, ExameStatus } from '../interfaces/exame';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './apiClient';

export function getExamesByPet(petId: number): Promise<Exame[]> {
  return apiGet<Exame[]>(`/api/pets/${petId}/exames`);
}

export function createExame(petId: number, data: CreateExameInput): Promise<Exame> {
  return apiPost<Exame>(`/api/pets/${petId}/exames`, data);
}

export async function updateExame(petId: number, exameId: number, data: CreateExameInput): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/exames/${exameId}`, data);
}

export async function updateExameStatus(petId: number, exameId: number, status: ExameStatus): Promise<void> {
  await apiPatch<void>(`/api/pets/${petId}/exames/${exameId}/status`, { status });
}

export function deleteExame(petId: number, exameId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/exames/${exameId}`);
}
