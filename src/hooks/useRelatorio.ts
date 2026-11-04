import { useQuery } from '@tanstack/react-query';
import { getRelatorio } from '../services/relatorioService';
import { useAuth } from '../providers/AuthProvider';
import { queryKeys } from './queryKeys';

export function useRelatorio() {
  const { role } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.relatorio, role],
    queryFn: () => getRelatorio(role as 'TUTOR' | 'VETERINARIO'),
    enabled: role !== null,
  });
}
