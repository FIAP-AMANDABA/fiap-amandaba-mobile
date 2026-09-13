import { useEffect, useState } from 'react';
import type { Tutor } from '../../interfaces/tutor';
import { getCurrentTutor } from '../../services/tutorService';

interface PerfilData {
  tutor: Tutor | null;
  loading: boolean;
}

export function usePerfil(): PerfilData {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCurrentTutor()
      .then((data) => {
        if (!cancelled) setTutor(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tutor, loading };
}
