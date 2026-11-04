import type { Compartilhamento, PacienteResumo, PacientesPage } from '../interfaces/veterinario';
import { apiGet, apiPatch, apiPost } from './apiClient';

const PATIENTS_PAGE_SIZE = 100; // limite máximo aceito pela API

export function getCompartilhamentos(petId: number): Promise<Compartilhamento[]> {
  return apiGet<Compartilhamento[]>(`/api/pets/${petId}/veterinarios`);
}

export function compartilharPet(petId: number, veterinarioId: number): Promise<Compartilhamento> {
  return apiPost<Compartilhamento>(`/api/pets/${petId}/veterinarios`, { veterinarioId });
}

export async function revogarCompartilhamento(petId: number, veterinarioId: number): Promise<void> {
  await apiPatch<void>(`/api/pets/${petId}/veterinarios/${veterinarioId}/revogar`, undefined);
}

export async function getPacientes(): Promise<PacienteResumo[]> {
  const page = await apiGet<PacientesPage>(`/api/veterinarios/me/pets?pagina=1&tamanho=${PATIENTS_PAGE_SIZE}`);
  return page.dados;
}
