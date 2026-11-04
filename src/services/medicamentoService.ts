import type { CreateMedicamentoInput, Medicamento, MedicamentoStatus } from '../interfaces/medicamento';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from './apiClient';

export function getMedicamentosByPet(petId: number, status?: MedicamentoStatus): Promise<Medicamento[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiGet<Medicamento[]>(`/api/pets/${petId}/medicamentos${query}`);
}

export function createMedicamento(petId: number, data: CreateMedicamentoInput): Promise<Medicamento> {
  return apiPost<Medicamento>(`/api/pets/${petId}/medicamentos`, data);
}

export async function updateMedicamento(
  petId: number,
  medicamentoId: number,
  data: CreateMedicamentoInput
): Promise<void> {
  await apiPut<void>(`/api/pets/${petId}/medicamentos/${medicamentoId}`, data);
}

export async function updateMedicamentoStatus(
  petId: number,
  medicamentoId: number,
  status: MedicamentoStatus
): Promise<void> {
  await apiPatch<void>(`/api/pets/${petId}/medicamentos/${medicamentoId}/status`, { status });
}

export function deleteMedicamento(petId: number, medicamentoId: number): Promise<void> {
  return apiDelete(`/api/pets/${petId}/medicamentos/${medicamentoId}`);
}
