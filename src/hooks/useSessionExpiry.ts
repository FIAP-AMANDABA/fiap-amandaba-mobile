import { useEffect } from 'react';
import { setUnauthorizedHandler } from '../services/authToken';
import { clearLocalUserData } from '../services/localDataCleanup';
import { useAuth } from '../providers/AuthProvider';
import { resetToLogin } from '../navigation/navigationRef';

// O JWT dura 1 hora: se a API o recusar, a sessão acaba e o usuário volta ao login com um aviso.
export function useSessionExpiry(): void {
  const { signOut } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearLocalUserData()
        .catch(() => undefined)
        .then(signOut)
        .then(() => resetToLogin({ expired: true }));
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);
}
