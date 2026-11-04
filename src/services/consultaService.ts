import type { Consulta, ConsultaStatus, CreateConsultaInput } from '../interfaces/consulta';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './apiClient';

export function getConsultasByPet(petId: number): Promise<Consulta[]> {
  return apiGet<Consulta[]>(`/api/pets/${petId}/consultas`);
}

export function createConsulta(petId: number, data: CreateConsultaInput): Promise<Consulta> {
  return apiPost<Consulta>(`/api/pets/${petId}/consultas`, data);
}

export async function updateConsultaStatus(
  petId: number,
  consultaId: number,
  status: ConsultaStatus
): Promise<void> {
  await apiPatch<void>(`/api/pets/${petId}/consultas/${consultaId}/status`, { status });
}

export async function updateConsulta(petId: number, consultaId: number, data: CreateConsultaInput): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/consultas/${consultaId}`, data);
}

export function deleteConsulta(petId: number, consultaId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/consultas/${consultaId}`);
}
