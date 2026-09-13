import type { Peso } from '../interfaces/peso';
import { apiGet, apiPost } from './apiClient';

export function getPesosByPet(petId: number): Promise<Peso[]> {
  return apiGet<Peso[]>(`/api/pets/${petId}/pesos`);
}

export function getPesoAtual(petId: number): Promise<Peso> {
  return apiGet<Peso>(`/api/pets/${petId}/pesos/atual`);
}

export function registerPeso(petId: number, peso: number, dataMedicao: string): Promise<Peso> {
  return apiPost<Peso>(`/api/pets/${petId}/pesos`, { peso, dataMedicao });
}
