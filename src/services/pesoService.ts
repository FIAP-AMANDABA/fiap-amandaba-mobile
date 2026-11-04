import type { Peso } from '../interfaces/peso';
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';
import { ApiError } from './http';

export function getPesosByPet(petId: number): Promise<Peso[]> {
  return apiGet<Peso[]>(`/api/pets/${petId}/pesos`);
}

// Pet sem nenhuma medição ainda: a API responde 404 — aqui isso vira "sem peso", não erro.
export async function getPesoAtual(petId: number): Promise<Peso | null> {
  try {
    return await apiGet<Peso>(`/api/pets/${petId}/pesos/atual`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function registerPeso(petId: number, peso: number, dataMedicao: string): Promise<Peso> {
  return apiPost<Peso>(`/api/pets/${petId}/pesos`, { peso, dataMedicao });
}

export async function updatePeso(petId: number, pesoId: number, peso: number, dataMedicao: string): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/pesos/${pesoId}`, { peso, dataMedicao });
}

export function deletePeso(petId: number, pesoId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/pesos/${pesoId}`);
}
