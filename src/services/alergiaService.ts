import type { Alergia, CreateAlergiaInput } from '../interfaces/alergia';
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export function getAlergiasByPet(petId: number): Promise<Alergia[]> {
  return apiGet<Alergia[]>(`/api/pets/${petId}/alergias`);
}

export function createAlergia(petId: number, data: CreateAlergiaInput): Promise<Alergia> {
  return apiPost<Alergia>(`/api/pets/${petId}/alergias`, data);
}

export async function updateAlergia(petId: number, alergiaId: number, data: CreateAlergiaInput): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/alergias/${alergiaId}`, data);
}

export function deleteAlergia(petId: number, alergiaId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/alergias/${alergiaId}`);
}
