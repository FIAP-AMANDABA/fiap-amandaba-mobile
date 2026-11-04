import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateVacinaAplicacaoInput } from '../interfaces/vacina';
import {
  createVacinaAplicacao,
  deleteVacinaAplicacao,
  getVacinaCatalogo,
  getVacinasByPet,
  updateVacinaAplicacao,
} from '../services/vacinaService';
import { queryKeys } from './queryKeys';
import { invalidateWithReport, useDeleteRecord, useUpdateRecord } from './useRecordMutations';

export function useVacinas(petId: number) {
  return useQuery({
    queryKey: queryKeys.petVacinas(petId),
    queryFn: () => getVacinasByPet(petId),
  });
}

export function useVacinaCatalogo() {
  return useQuery({
    queryKey: queryKeys.vacinaCatalogo,
    queryFn: getVacinaCatalogo,
    staleTime: 10 * 60_000,
  });
}

export function useCreateVacina(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVacinaAplicacaoInput) => createVacinaAplicacao(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petVacinas(petId)),
  });
}

export const useUpdateVacina = (petId: number) =>
  useUpdateRecord<CreateVacinaAplicacaoInput>(
    (id, input) => updateVacinaAplicacao(petId, id, input),
    queryKeys.petVacinas(petId)
  );

export const useDeleteVacina = (petId: number) =>
  useDeleteRecord((id) => deleteVacinaAplicacao(petId, id), queryKeys.petVacinas(petId));
