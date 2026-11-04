import { useQueries, type QueryKey, type UseQueryResult } from '@tanstack/react-query';
import type { Pet } from '../interfaces/pet';
import { getVacinasByPet } from '../services/vacinaService';
import { getMedicamentosByPet } from '../services/medicamentoService';
import { getConsultasByPet } from '../services/consultaService';
import { queryKeys } from './queryKeys';
import { usePets } from './usePets';

const NO_PETS: Pet[] = [];

// Funções `combine` fora do componente: com referência estável, o TanStack só recombina quando os dados mudam.
function combineByPet<T>() {
  const empty: T[] = [];
  return (results: UseQueryResult<T[]>[]) => ({
    data: results.map((result) => result.data ?? empty),
    isLoading: results.some((result) => result.isLoading),
  });
}

const combineVacinas = combineByPet<Awaited<ReturnType<typeof getVacinasByPet>>[number]>();
const combineMedicamentos = combineByPet<Awaited<ReturnType<typeof getMedicamentosByPet>>[number]>();
const combineConsultas = combineByPet<Awaited<ReturnType<typeof getConsultasByPet>>[number]>();

function perPetQueries<T>(pets: Pet[], keyFor: (petId: number) => QueryKey, fetchFor: (petId: number) => Promise<T>) {
  return pets.map((pet) => ({ queryKey: keyFor(pet.idPet), queryFn: () => fetchFor(pet.idPet) }));
}

// Uma falha isolada vira lista vazia para aquele pet.
export function usePetsHealthData() {
  const petsQuery = usePets();
  const pets = petsQuery.data ?? NO_PETS;

  const vacinas = useQueries({
    queries: perPetQueries(pets, queryKeys.petVacinas, getVacinasByPet),
    combine: combineVacinas,
  });
  const medicamentos = useQueries({
    queries: perPetQueries(pets, (id) => queryKeys.petMedicamentos(id, 'EM_USO'), (id) => getMedicamentosByPet(id, 'EM_USO')),
    combine: combineMedicamentos,
  });
  const consultas = useQueries({
    queries: perPetQueries(pets, queryKeys.petConsultas, getConsultasByPet),
    combine: combineConsultas,
  });

  return {
    pets,
    vacinasPorPet: vacinas.data,
    medicamentosPorPet: medicamentos.data,
    consultasPorPet: consultas.data,
    isLoading: petsQuery.isLoading || vacinas.isLoading || medicamentos.isLoading || consultas.isLoading,
    error: petsQuery.error,
  };
}
