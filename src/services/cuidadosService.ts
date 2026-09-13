import type { PlanoCuidados } from '../interfaces/cuidados';
import { apiGet } from './apiClient';

export function gerarPlanoCuidados(petId: number): Promise<PlanoCuidados> {
  return apiGet<PlanoCuidados>(`/api/pets/${petId}/plano-cuidados`);
}
