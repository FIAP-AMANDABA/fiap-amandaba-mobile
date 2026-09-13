import type { Doenca } from '../interfaces/doenca';
import { apiGet, apiPost } from './apiClient';

export function getDoencasByPet(petId: number): Promise<Doenca[]> {
  return apiGet<Doenca[]>(`/api/pets/${petId}/doencas`);
}

export interface CreateDoencaInput {
  nome: string;
  dataDiagnostico?: string;
  status: 'ATIVA' | 'CONTROLADA' | 'ENCERRADA';
  tratamento?: string;
  observacao?: string;
}

export function createDoenca(petId: number, data: CreateDoencaInput): Promise<Doenca> {
  return apiPost<Doenca>(`/api/pets/${petId}/doencas`, data);
}
