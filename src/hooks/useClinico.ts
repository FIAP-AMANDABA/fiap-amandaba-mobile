import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateDoencaInput } from '../interfaces/doenca';
import type { CreateAlergiaInput } from '../interfaces/alergia';
import type { CreateMedicamentoInput, MedicamentoStatus } from '../interfaces/medicamento';
import { createDoenca, deleteDoenca, getDoencasByPet, updateDoenca } from '../services/doencaService';
import { createAlergia, deleteAlergia, getAlergiasByPet, updateAlergia } from '../services/alergiaService';
import {
  createMedicamento,
  deleteMedicamento,
  getMedicamentosByPet,
  updateMedicamento,
  updateMedicamentoStatus,
} from '../services/medicamentoService';
import { queryKeys } from './queryKeys';
import { invalidateWithReport, useChangeRecordStatus, useDeleteRecord, useUpdateRecord } from './useRecordMutations';

// Invalidar ['pet', id, 'medicamentos'] atinge todas as variações da lista (todos / EM_USO).
const medicamentosKey = (petId: number) => ['pet', petId, 'medicamentos'] as const;

export function useDoencas(petId: number) {
  return useQuery({
    queryKey: queryKeys.petDoencas(petId),
    queryFn: () => getDoencasByPet(petId),
  });
}

export function useAlergias(petId: number) {
  return useQuery({
    queryKey: queryKeys.petAlergias(petId),
    queryFn: () => getAlergiasByPet(petId),
  });
}

export function useMedicamentos(petId: number, status?: MedicamentoStatus) {
  return useQuery({
    queryKey: queryKeys.petMedicamentos(petId, status),
    queryFn: () => getMedicamentosByPet(petId, status),
  });
}

export function useCreateDoenca(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDoencaInput) => createDoenca(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petDoencas(petId)),
  });
}

export function useCreateAlergia(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAlergiaInput) => createAlergia(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petAlergias(petId)),
  });
}

export function useCreateMedicamento(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMedicamentoInput) => createMedicamento(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, medicamentosKey(petId)),
  });
}

export const useUpdateDoenca = (petId: number) =>
  useUpdateRecord<CreateDoencaInput>((id, input) => updateDoenca(petId, id, input), queryKeys.petDoencas(petId));
export const useDeleteDoenca = (petId: number) =>
  useDeleteRecord((id) => deleteDoenca(petId, id), queryKeys.petDoencas(petId));

export const useUpdateAlergia = (petId: number) =>
  useUpdateRecord<CreateAlergiaInput>((id, input) => updateAlergia(petId, id, input), queryKeys.petAlergias(petId));
export const useDeleteAlergia = (petId: number) =>
  useDeleteRecord((id) => deleteAlergia(petId, id), queryKeys.petAlergias(petId));

export const useUpdateMedicamento = (petId: number) =>
  useUpdateRecord<CreateMedicamentoInput>(
    (id, input) => updateMedicamento(petId, id, input),
    medicamentosKey(petId)
  );
export const useDeleteMedicamento = (petId: number) =>
  useDeleteRecord((id) => deleteMedicamento(petId, id), medicamentosKey(petId));
export const useChangeMedicamentoStatus = (petId: number) =>
  useChangeRecordStatus<MedicamentoStatus>(
    (id, status) => updateMedicamentoStatus(petId, id, status),
    medicamentosKey(petId)
  );
