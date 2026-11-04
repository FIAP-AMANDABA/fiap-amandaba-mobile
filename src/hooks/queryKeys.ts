import type { MedicamentoStatus } from '../interfaces/medicamento';

// Chaves hierárquicas: invalidar ['pet', id] atualiza tudo daquele pet.
export const queryKeys = {
  profile: (userId: number) => ['profile', userId] as const,
  pacientes: ['veterinario', 'pacientes'] as const,
  veterinarioBusca: (field: string, text: string) => ['veterinarios', 'busca', field, text] as const,
  relatorio: ['relatorio'] as const,
  petIdade: (petId: number) => ['pet', petId, 'idade'] as const,
  petsMe: (nome: string) => ['pets', 'me', nome] as const,
  veterinario: (idVeterinario: number) => ['veterinarios', idVeterinario] as const,
  petCompartilhamentos: (petId: number) => ['pet', petId, 'compartilhamentos'] as const,
  especies: ['especies'] as const,
  vacinaCatalogo: ['vacinas', 'catalogo'] as const,
  pets: (tutorId: number) => ['pets', tutorId] as const,
  pet: (petId: number) => ['pet', petId] as const,
  petPesoAtual: (petId: number) => ['pet', petId, 'peso-atual'] as const,
  petPesos: (petId: number) => ['pet', petId, 'pesos'] as const,
  petVacinas: (petId: number) => ['pet', petId, 'vacinas'] as const,
  petDoencas: (petId: number) => ['pet', petId, 'doencas'] as const,
  petAlergias: (petId: number) => ['pet', petId, 'alergias'] as const,
  petMedicamentos: (petId: number, status?: MedicamentoStatus) =>
    ['pet', petId, 'medicamentos', status ?? 'todos'] as const,
  petExames: (petId: number) => ['pet', petId, 'exames'] as const,
  petConsultas: (petId: number) => ['pet', petId, 'consultas'] as const,
  reminderStatus: ['reminders', 'status'] as const,
  reminderHistory: ['reminders', 'history'] as const,
};

export const petsRootKey = ['pets'] as const;
export const petRootKey = (petId: number) => ['pet', petId] as const;
