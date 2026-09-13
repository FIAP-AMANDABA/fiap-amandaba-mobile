import type { Alergia } from '../interfaces/alergia';
import { apiGet, apiPost } from './apiClient';

export function getAlergiasByPet(petId: number): Promise<Alergia[]> {
  return apiGet<Alergia[]>(`/api/pets/${petId}/alergias`);
}

export interface CreateAlergiaInput {
  nome: string;
  tipo?: 'MEDICAMENTO' | 'ALIMENTO' | 'AMBIENTAL' | 'OUTRO';
  dataIdentificacao?: string;
  reacao?: string;
  gravidade?: 'LEVE' | 'MODERADA' | 'GRAVE';
  observacao?: string;
}

export function createAlergia(petId: number, data: CreateAlergiaInput): Promise<Alergia> {
  return apiPost<Alergia>(`/api/pets/${petId}/alergias`, data);
}
