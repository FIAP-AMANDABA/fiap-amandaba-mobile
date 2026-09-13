import { useEffect, useState } from 'react';
import type { Pet } from '../../../interfaces/pet';
import { getPetById } from '../../../services/petService';

interface PetDetailData {
  pet: Pet | null;
  loading: boolean;
  error: string | null;
}

export function usePetDetail(petId: number): PetDetailData {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getPetById(petId)
      .then((data) => {
        if (!cancelled) setPet(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar pet.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  return { pet, loading, error };
}
