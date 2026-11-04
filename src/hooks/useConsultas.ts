import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConsultaStatus, CreateConsultaInput } from '../interfaces/consulta';
import { sortConsultas } from '../domain/consultas';
import {
  createConsulta,
  deleteConsulta,
  getConsultasByPet,
  updateConsulta,
  updateConsultaStatus,
} from '../services/consultaService';
import { queryKeys } from './queryKeys';
import { invalidateWithReport, useDeleteRecord, useUpdateRecord } from './useRecordMutations';

export function useConsultas(petId: number) {
  const query = useQuery({
    queryKey: queryKeys.petConsultas(petId),
    queryFn: () => getConsultasByPet(petId),
  });

  const consultas = useMemo(() => sortConsultas(query.data ?? []), [query.data]);

  return { ...query, consultas };
}

export function useCreateConsulta(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateConsultaInput) => createConsulta(petId, input),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petConsultas(petId)),
  });
}

export function useUpdateConsultaStatus(petId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consultaId, status }: { consultaId: number; status: ConsultaStatus }) =>
      updateConsultaStatus(petId, consultaId, status),
    onSuccess: () => invalidateWithReport(queryClient, queryKeys.petConsultas(petId)),
  });
}

export const useUpdateConsulta = (petId: number) =>
  useUpdateRecord<CreateConsultaInput>(
    (id, input) => updateConsulta(petId, id, input),
    queryKeys.petConsultas(petId)
  );
export const useDeleteConsulta = (petId: number) =>
  useDeleteRecord((id) => deleteConsulta(petId, id), queryKeys.petConsultas(petId));
