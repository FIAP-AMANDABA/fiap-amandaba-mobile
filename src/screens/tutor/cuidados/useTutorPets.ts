import { useEffect, useState } from 'react';
import type { Pet } from '../../../interfaces/pet';
import { getCurrentTutor } from '../../../services/tutorService';
import { getPetsByTutor } from '../../../services/petService';

interface TutorPetsData {
  pets: Pet[];
  loading: boolean;
  error: string | null;
}

export function useTutorPets(): TutorPetsData {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return { pets, loading, error };
}
