import type { Pet } from '../interfaces/pet';
import { apiGet, apiPost, apiPatch } from './apiClient';

export interface CreatePetInput {
  idEspecie: number;
  nome: string;
  fotoUrl?: string;
  raca?: string;
  sexo?: string;
  dataNascimento?: string;
  cor?: string;
  castrado: boolean;
  microchip?: string;
}

export function getPetsByTutor(idTutor: number): Promise<Pet[]> {
  return apiGet<Pet[]>(`/api/tutores/${idTutor}/pets`);
}

export function getPetById(petId: number): Promise<Pet> {
  return apiGet<Pet>(`/api/pets/${petId}`);
}

export function createPet(idTutor: number, data: CreatePetInput): Promise<Pet> {
  return apiPost<Pet>(`/api/tutores/${idTutor}/pets`, data);
}

export function updatePetStatus(petId: number, status: 'ATIVO' | 'INATIVO'): Promise<void> {
  return apiPatch<void>(`/api/pets/${petId}/status`, { status });
}
