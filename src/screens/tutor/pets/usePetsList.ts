import { useCallback, useEffect, useState } from 'react';
import type { Pet } from '../../../interfaces/pet';
import type { Tutor } from '../../../interfaces/tutor';
import { getCurrentTutor } from '../../../services/tutorService';
import { getPetsByTutor, updatePetStatus } from '../../../services/petService';
import { getPesoAtual } from '../../../services/pesoService';

interface PetsListData {
  tutor: Tutor | null;
  pets: Pet[];
  pesos: Record<number, number | null>;
  loading: boolean;
  error: string | null;
  toggleStatus: (pet: Pet) => Promise<void>;
  reload: () => void;
}

export function usePetsList(): PetsListData {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [pesos, setPesos] = useState<Record<number, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const currentTutor = await getCurrentTutor();
        if (cancelled) return;
        setTutor(currentTutor);

        if (!currentTutor) {
          setLoading(false);
          return;
        }

        const tutorPets = await getPetsByTutor(currentTutor.idTutor);
        if (cancelled) return;
        setPets(tutorPets);

        const pesoEntries = await Promise.all(
          tutorPets.map(async (pet) => {
            try {
              const atual = await getPesoAtual(pet.idPet);
              return [pet.idPet, atual.peso] as const;
            } catch {
              return [pet.idPet, null] as const;
            }
          })
        );
        if (cancelled) return;
        setPesos(Object.fromEntries(pesoEntries));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar pets.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const toggleStatus = useCallback(async (pet: Pet) => {
    const newStatus = pet.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    await updatePetStatus(pet.idPet, newStatus);
    setPets((current) =>
      current.map((p) => (p.idPet === pet.idPet ? { ...p, status: newStatus } : p))
    );
  }, []);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { tutor, pets, pesos, loading, error, toggleStatus, reload };
}
