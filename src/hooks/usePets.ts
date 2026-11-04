import { useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { CreatePetInput, Pet } from '../interfaces/pet';
import type { Peso } from '../interfaces/peso';
import {
  createPet,
  getMyPetsPage,
  getPetById,
  getPetIdade,
  getPetsByTutor,
  updatePet,
  updatePetStatus,
} from '../services/petService';
import { getPesoAtual } from '../services/pesoService';
import { getEspecies } from '../services/especieService';
import { petRootKey, petsRootKey, queryKeys } from './queryKeys';
import { useAuth } from '../providers/AuthProvider';

export function usePets() {
  const { tutorId } = useAuth();

  return useQuery({
    queryKey: queryKeys.pets(tutorId ?? -1),
    queryFn: () => getPetsByTutor(tutorId as number),
    enabled: tutorId !== null,
  });
}

export function useMyPetsSearch(nome: string) {
  const { tutorId } = useAuth();

  const query = useInfiniteQuery({
    queryKey: queryKeys.petsMe(nome.trim()),
    queryFn: ({ pageParam }) => getMyPetsPage(pageParam, nome),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.pagina + 1 : undefined),
    enabled: tutorId !== null,
  });

  return { ...query, pets: query.data?.pages.flatMap((page) => page.pets) ?? [] };
}

export function usePetIdade(petId: number) {
  return useQuery({
    queryKey: queryKeys.petIdade(petId),
    queryFn: () => getPetIdade(petId),
  });
}

export function usePet(petId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.pet(petId ?? -1),
    queryFn: () => getPetById(petId as number),
    enabled: petId !== undefined,
  });
}

export function useEspecies() {
  return useQuery({
    queryKey: queryKeys.especies,
    queryFn: getEspecies,
    staleTime: 10 * 60_000,
  });
}

export function usePesosAtuais(pets: Pet[]): Record<number, number | null> {
  const combine = useCallback(
    (results: UseQueryResult<Peso | null>[]) =>
      Object.fromEntries(results.map((result, index) => [pets[index].idPet, result.data?.peso ?? null])),
    [pets]
  );

  return useQueries({
    queries: pets.map((pet) => ({
      queryKey: queryKeys.petPesoAtual(pet.idPet),
      queryFn: () => getPesoAtual(pet.idPet),
    })),
    combine,
  });
}

export function useCreatePet() {
  const { tutorId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePetInput) => {
      if (tutorId === null) throw new Error('Não foi possível identificar o tutor logado.');
      return createPet(tutorId, input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: petsRootKey }),
  });
}

export function useUpdatePet(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePetInput) => updatePet(petId, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: petsRootKey }),
        queryClient.invalidateQueries({ queryKey: petRootKey(petId) }),
      ]),
  });
}

export function useUpdatePetStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, status }: { petId: number; status: 'ATIVO' | 'INATIVO' }) =>
      updatePetStatus(petId, status),
    onSuccess: (_data, { petId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: petsRootKey }),
        queryClient.invalidateQueries({ queryKey: petRootKey(petId) }),
      ]),
  });
}
