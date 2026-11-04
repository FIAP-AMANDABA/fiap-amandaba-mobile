import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChangePasswordRequest } from '../interfaces/auth';
import type { ProfileSubmission } from '../domain/profileInputs';
import { ApiError } from '../services/http';
import { changeMyPassword, deactivateMyAccount, updateMyCrmv, updateMyProfile } from '../services/userService';
import { useAuth } from '../providers/AuthProvider';
import { queryKeys } from './queryKeys';
import { useLogout } from './useAuthMutations';

export function useUpdateProfile() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profile, crmv }: ProfileSubmission) => {
      await updateMyProfile(profile);
      if (crmv !== undefined) await updateMyCrmv({ crmv });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId as number) }),
  });
}

export function useDeleteAccount() {
  const logout = useLogout();

  return useMutation({
    mutationFn: deactivateMyAccount,
    onSuccess: () => logout(),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      try {
        await changeMyPassword(data);
      } catch (error) {
        // Os dados já foram validados no app; um 400 aqui é a senha atual incorreta.
        if (error instanceof ApiError && error.status === 400) throw new Error('Senha atual incorreta.');
        throw error;
      }
    },
  });
}
