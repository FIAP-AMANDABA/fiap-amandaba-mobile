import { useMemo } from 'react';
import {
  buildCicloItems,
  buildUpcomingDoses,
  countActivePets,
  countOverdueCycles,
} from '../domain/homeAggregation';
import { getErrorMessage } from '../services/http';
import { useCurrentProfile } from './useProfile';
import { usePetsHealthData } from './usePetsHealthData';

export function useHomeData() {
  const tutorQuery = useCurrentProfile();
  const { pets, vacinasPorPet, medicamentosPorPet, isLoading, error } = usePetsHealthData();

  const upcomingDoses = useMemo(() => buildUpcomingDoses(pets, vacinasPorPet), [pets, vacinasPorPet]);
  const cicloItems = useMemo(() => buildCicloItems(pets, medicamentosPorPet), [pets, medicamentosPorPet]);

  const failure = tutorQuery.error ?? error;

  return {
    tutor: tutorQuery.data ?? null,
    pets,
    petsAtivos: countActivePets(pets),
    upcomingDoses,
    cicloItems,
    ciclosAtrasados: countOverdueCycles(cicloItems),
    isLoading: tutorQuery.isLoading || isLoading,
    errorMessage: failure ? getErrorMessage(failure, 'Erro ao carregar dados.') : null,
  };
}
