import type { CreateVacinaAplicacaoInput, VacinaAplicacao, VacinaCatalogo } from '../interfaces/vacina';
import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';

export function getVacinasByPet(petId: number): Promise<VacinaAplicacao[]> {
  return apiGet<VacinaAplicacao[]>(`/api/pets/${petId}/vacinas`);
}

export function getVacinaCatalogo(): Promise<VacinaCatalogo[]> {
  return apiGet<VacinaCatalogo[]>('/api/vacinas');
}

export function createVacinaAplicacao(
  petId: number,
  data: CreateVacinaAplicacaoInput
): Promise<VacinaAplicacao> {
  return apiPost<VacinaAplicacao>(`/api/pets/${petId}/vacinas`, data);
}

export async function updateVacinaAplicacao(
  petId: number,
  aplicacaoId: number,
  data: CreateVacinaAplicacaoInput
): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/vacinas/${aplicacaoId}`, data);
}

export function deleteVacinaAplicacao(petId: number, aplicacaoId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/vacinas/${aplicacaoId}`);
}
