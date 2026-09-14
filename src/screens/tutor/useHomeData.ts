import { useCallback, useEffect, useState } from 'react';
import type { Pet } from '../../interfaces/pet';
import type { Tutor } from '../../interfaces/tutor';
import type { UpcomingDose, CicloItem } from '../../interfaces/home';
import { getCurrentTutor } from '../../services/tutorService';
import { getPetsByTutor } from '../../services/petService';
import { getVacinasByPet } from '../../services/vacinaService';
import { getMedicamentosByPet } from '../../services/medicamentoService';
import { buildUpcomingDoses, buildCicloItems } from '../../services/homeAggregation';

interface HomeData {
  tutor: Tutor | null;
  pets: Pet[];
  upcomingDoses: UpcomingDose[];
  cicloItems: CicloItem[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useHomeData(): HomeData {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [upcomingDoses, setUpcomingDoses] = useState<UpcomingDose[]>([]);
  const [cicloItems, setCicloItems] = useState<CicloItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

        // Uma falha isolada (rede, pet sem dados ainda) não deve derrubar o dashboard inteiro.
        const [vacinasPorPet, medicamentosPorPet] = await Promise.all([
          Promise.all(tutorPets.map((pet) => getVacinasByPet(pet.idPet).catch(() => []))),
          Promise.all(tutorPets.map((pet) => getMedicamentosByPet(pet.idPet, 'EM_USO').catch(() => []))),
        ]);
        if (cancelled) return;

        setUpcomingDoses(buildUpcomingDoses(tutorPets, vacinasPorPet));
        setCicloItems(buildCicloItems(tutorPets, medicamentosPorPet));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
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

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return { tutor, pets, upcomingDoses, cicloItems, loading, error, reload };
}
