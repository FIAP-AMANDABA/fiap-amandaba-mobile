import { useCallback, useEffect, useState } from 'react';
import type { Pet } from '../../../interfaces/pet';
import { getCurrentTutor } from '../../../services/tutorService';
import { getPetsByTutor } from '../../../services/petService';

interface TutorPetsData {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTutorPets(): TutorPetsData {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const tutor = await getCurrentTutor();
        if (cancelled) return;

        if (!tutor) {
          setLoading(false);
          return;
        }

        const tutorPets = await getPetsByTutor(tutor.idTutor);
        if (!cancelled) setPets(tutorPets);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar pets.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { pets, loading, error, reload };
}
