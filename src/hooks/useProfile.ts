import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../services/userService';
import { ApiError } from '../services/http';
import { useAuth } from '../providers/AuthProvider';
import { queryKeys } from './queryKeys';
import { useLogout } from './useAuthMutations';

export function useCurrentProfile() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile(userId ?? -1),
    queryFn: getMyProfile,
    enabled: userId !== null,
    staleTime: 5 * 60_000,
  });
}

// Conta desativada (403) encerra a sessão; token vencido (401) é tratado pelo cliente HTTP.
export function useSessionGuard(): void {
  const { error } = useCurrentProfile();
  const logout = useLogout();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 403) {
      void logout();
    }
  }, [error, logout]);
}
