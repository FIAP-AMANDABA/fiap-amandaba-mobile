import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateExameInput, ExameStatus } from '../interfaces/exame';
import {
  createExame,
  deleteExame,
  getExamesByPet,
  updateExame,
  updateExameStatus,
} from '../services/exameService';
import { queryKeys } from './queryKeys';
import { invalidateWithReport, useChangeRecordStatus, useDeleteRecord, useUpdateRecord } from './useRecordMutations';

export function useExames(petId: number) {
  return useQuery({
    queryKey: queryKeys.petExames(petId),
    queryFn: () => getExamesByPet(petId),
  });
}

export function useCreateExame(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExameInput) => createExame(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petExames(petId)),
  });
}

export const useUpdateExame = (petId: number) =>
  useUpdateRecord<CreateExameInput>((id, input) => updateExame(petId, id, input), queryKeys.petExames(petId));
export const useDeleteExame = (petId: number) =>
  useDeleteRecord((id) => deleteExame(petId, id), queryKeys.petExames(petId));
export const useChangeExameStatus = (petId: number) =>
  useChangeRecordStatus<ExameStatus>((id, status) => updateExameStatus(petId, id, status), queryKeys.petExames(petId));
