import { useMemo } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { availableToShare, sortShares } from '../domain/compartilhamento';
import {
  compartilharPet,
  getCompartilhamentos,
  getPacientes,
  revogarCompartilhamento,
} from '../services/compartilhamentoService';
import { getVeterinario, searchVeterinarios, type VeterinarioSearchField } from '../services/veterinarioService';
import { useAuth } from '../providers/AuthProvider';
import { queryKeys } from './queryKeys';

export function usePacientes() {
  const { veterinarioId } = useAuth();

  return useQuery({
    queryKey: queryKeys.pacientes,
    queryFn: getPacientes,
    enabled: veterinarioId !== null,
  });
}

function usePetShares(petId: number) {
  return useQuery({
    queryKey: queryKeys.petCompartilhamentos(petId),
    queryFn: () => getCompartilhamentos(petId),
  });
}

// A API de compartilhamento devolve só o id; nome e CRMV vêm da API de usuários.
export function usePetVeterinarios(petId: number) {
  const sharesQuery = usePetShares(petId);

  const shares = useMemo(() => sortShares(sharesQuery.data ?? []), [sharesQuery.data]);

  const vets = useQueries({
    queries: shares.map((share) => ({
      queryKey: queryKeys.veterinario(share.idVeterinario),
      queryFn: () => getVeterinario(share.idVeterinario),
      staleTime: 10 * 60_000,
      retry: false,
    })),
  });

  return {
    isLoading: sharesQuery.isLoading,
    error: sharesQuery.error,
    items: shares.map((share, index) => ({ share, veterinario: vets[index]?.data ?? null })),
    shares,
  };
}

export function useVeterinarioSearch(field: VeterinarioSearchField, text: string, petId: number) {
  const { data: shares = [] } = usePetShares(petId);
  const search = useQuery({
    queryKey: queryKeys.veterinarioBusca(field, text.trim()),
    queryFn: () => searchVeterinarios(field, text),
  });

  return {
    ...search,
    results: availableToShare(search.data ?? [], shares),
  };
}

export function useSharePet(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (veterinarioId: number) => compartilharPet(petId, veterinarioId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.petCompartilhamentos(petId) }),
  });
}

export function useRevokeShare(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (veterinarioId: number) => revogarCompartilhamento(petId, veterinarioId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.petCompartilhamentos(petId) }),
  });
}
