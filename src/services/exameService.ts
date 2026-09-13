import type { Exame } from '../interfaces/exame';
import { apiGet, apiPost } from './apiClient';

export function getExamesByPet(petId: number, status?: string): Promise<Exame[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiGet<Exame[]>(`/api/pets/${petId}/exames${query}`);
}

export interface CreateExameInput {
  nome: string;
  dataSolicitacao?: string;
  dataRealizacao?: string;
  veterinario?: string;
  clinica?: string;
  motivo?: string;
  resultado?: string;
  observacao?: string;
  arquivo?: string;
  status: 'SOLICITADO' | 'REALIZADO' | 'RESULTADO_DISPONIVEL';
}

export function createExame(petId: number, data: CreateExameInput): Promise<Exame> {
  return apiPost<Exame>(`/api/pets/${petId}/exames`, data);
}
