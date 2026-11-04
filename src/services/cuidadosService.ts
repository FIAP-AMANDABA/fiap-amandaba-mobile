import type { PlanoCuidados } from '../interfaces/cuidados';
import { apiGet } from './apiClient';

// A IA leva de 10 a 20 segundos para responder; passado o limite, a espera termina com um aviso claro.
const CARE_PLAN_TIMEOUT_MS = 60_000;

export function gerarPlanoCuidados(petId: number): Promise<PlanoCuidados> {
  return apiGet<PlanoCuidados>(`/api/pets/${petId}/plano-cuidados`, { timeoutMs: CARE_PLAN_TIMEOUT_MS });
}
