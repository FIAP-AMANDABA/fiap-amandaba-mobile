import type { CreatePetInput, Pet } from '../interfaces/pet';
import { apiGet, apiPost, apiPut, apiPatch } from './apiClient';
import { ApiError } from './http';

export function getPetsByTutor(idTutor: number): Promise<Pet[]> {
  return apiGet<Pet[]>(`/api/tutores/${idTutor}/pets`);
}

export function getPetById(petId: number): Promise<Pet> {
  return apiGet<Pet>(`/api/pets/${petId}`);
}

export function createPet(idTutor: number, data: CreatePetInput): Promise<Pet> {
  return apiPost<Pet>(`/api/tutores/${idTutor}/pets`, data);
}

export function updatePet(petId: number, data: CreatePetInput): Promise<void> {
  return apiPut<void>(`/api/pets/${petId}`, data);
}

export function updatePetStatus(petId: number, status: 'ATIVO' | 'INATIVO'): Promise<void> {
  return apiPatch<void>(`/api/pets/${petId}/status`, { status });
}

const PETS_PAGE_SIZE = 10;

export interface PetsPage {
  pets: Pet[];
  pagina: number;
  hasMore: boolean;
}

// Cada item de GET /api/pets/me vem como { pet, links }.
export async function getMyPetsPage(pagina: number, nome: string): Promise<PetsPage> {
  const query = new URLSearchParams({ pagina: String(pagina), tamanho: String(PETS_PAGE_SIZE) });
  if (nome.trim()) query.set('nome', nome.trim());

  const response = await apiGet<{
    pagina: number;
    tamanho: number;
    total: number;
    dados: { pet: Pet }[];
  }>(`/api/pets/me?${query.toString()}`);

  return {
    pets: response.dados.map((item) => item.pet),
    pagina: response.pagina,
    hasMore: response.pagina * response.tamanho < response.total,
  };
}

// Sem data de nascimento a API responde 400: isso vira "idade desconhecida" (null).
export async function getPetIdade(petId: number): Promise<number | null> {
  try {
    const response = await apiGet<{ idadeAnos: number }>(`/api/pets/${petId}/integracao-oracle/idade`);
    return response.idadeAnos;
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) return null;
    throw error;
  }
}
