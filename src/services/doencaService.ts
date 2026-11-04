import type { CreateDoencaInput, Doenca } from '../interfaces/doenca';
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export function getDoencasByPet(petId: number): Promise<Doenca[]> {
  return apiGet<Doenca[]>(`/api/pets/${petId}/doencas`);
}

export function createDoenca(petId: number, data: CreateDoencaInput): Promise<Doenca> {
  return apiPost<Doenca>(`/api/pets/${petId}/doencas`, data);
}

export async function updateDoenca(petId: number, doencaId: number, data: CreateDoencaInput): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/doencas/${doencaId}`, data);
}

export function deleteDoenca(petId: number, doencaId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/doencas/${doencaId}`);
}
