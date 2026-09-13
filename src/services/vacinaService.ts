import type { VacinaAplicacao, VacinaCatalogo } from '../interfaces/vacina';
import { apiGet, apiPost } from './apiClient';

export function getVacinasByPet(petId: number): Promise<VacinaAplicacao[]> {
  return apiGet<VacinaAplicacao[]>(`/api/pets/${petId}/vacinas`);
}

export function getVacinaCatalogo(): Promise<VacinaCatalogo[]> {
  return apiGet<VacinaCatalogo[]>('/api/vacinas');
}

export interface CreateVacinaAplicacaoInput {
  idVacina: number;
  dataAplicacao: string;
  numeroDose?: number;
  numeroLote?: string;
  proximaDose?: string;
  clinica?: string;
  observacao?: string;
}

export function createVacinaAplicacao(
  petId: number,
  data: CreateVacinaAplicacaoInput
): Promise<VacinaAplicacao> {
  return apiPost<VacinaAplicacao>(`/api/pets/${petId}/vacinas`, data);
}
