import type { Especie } from '../interfaces/especie';
import { apiGet } from './apiClient';

export function getEspecies(): Promise<Especie[]> {
  return apiGet<Especie[]>('/api/especies');
}
