import type { Medicamento } from '../interfaces/medicamento';
import { apiGet, apiPost } from './apiClient';

export function getMedicamentosByPet(petId: number, status?: string): Promise<Medicamento[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiGet<Medicamento[]>(`/api/pets/${petId}/medicamentos${query}`);
}

export interface CreateMedicamentoInput {
  nome: string;
  motivo?: string;
  dosagem?: number;
  unidade?: string;
  quantidade?: string;
  frequencia?: string;
  administracao?: string;
  horario?: string;
  dataInicio: string;
  dataTermino?: string;
  status: 'EM_USO' | 'CONCLUIDO' | 'SUSPENSO';
  prescricao?: string;
  observacao?: string;
}

export function createMedicamento(petId: number, data: CreateMedicamentoInput): Promise<Medicamento> {
  return apiPost<Medicamento>(`/api/pets/${petId}/medicamentos`, data);
}
