import { useMutation, useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

// Os indicadores do relatório (doenças ativas, vacinas atrasadas...) saem dos mesmos registros.
export function invalidateWithReport(queryClient: QueryClient, key: QueryKey) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: key }),
    queryClient.invalidateQueries({ queryKey: queryKeys.relatorio }),
  ]);
}

export function useUpdateRecord<TInput>(
  update: (recordId: number, input: TInput) => Promise<unknown>,
  invalidateKey: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, input }: { recordId: number; input: TInput }) => update(recordId, input),
    onSuccess: () => invalidateWithReport(queryClient, invalidateKey),
  });
}

export function useDeleteRecord(remove: (recordId: number) => Promise<unknown>, invalidateKey: QueryKey) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: number) => remove(recordId),
    onSuccess: () => invalidateWithReport(queryClient, invalidateKey),
  });
}

export function useChangeRecordStatus<TStatus extends string>(
  change: (recordId: number, status: TStatus) => Promise<unknown>,
  invalidateKey: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, status }: { recordId: number; status: TStatus }) => change(recordId, status),
    onSuccess: () => invalidateWithReport(queryClient, invalidateKey),
  });
}
