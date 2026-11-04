import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePeso, getPesosByPet, registerPeso, updatePeso } from '../services/pesoService';
import { queryKeys } from './queryKeys';

export function usePesos(petId: number) {
  return useQuery({
    queryKey: queryKeys.petPesos(petId),
    queryFn: () => getPesosByPet(petId),
    select: (pesos) =>
      [...pesos].sort((a, b) => new Date(b.dataMedicao).getTime() - new Date(a.dataMedicao).getTime()),
  });
}

export function useRegisterPeso(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (peso: number) => registerPeso(petId, peso, new Date().toISOString()),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.petPesos(petId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.petPesoAtual(petId) }),
      ]),
  });
}

function usePesoInvalidation(petId: number) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.petPesos(petId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.petPesoAtual(petId) }),
    ]);
}

export function useUpdatePeso(petId: number) {
  const invalidate = usePesoInvalidation(petId);

  return useMutation({
    mutationFn: ({ pesoId, peso, dataMedicao }: { pesoId: number; peso: number; dataMedicao: string }) =>
      updatePeso(petId, pesoId, peso, dataMedicao),
    onSuccess: invalidate,
  });
}

export function useDeletePeso(petId: number) {
  const invalidate = usePesoInvalidation(petId);

  return useMutation({
    mutationFn: (pesoId: number) => deletePeso(petId, pesoId),
    onSuccess: invalidate,
  });
}
