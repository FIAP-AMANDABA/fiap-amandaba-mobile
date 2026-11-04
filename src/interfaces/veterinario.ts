export interface VeterinarioPublico {
  idVeterinario: number;
  nomeCompleto: string;
  crmv: string;
}

// Página do Spring (Page<T>) devolvida pela busca de veterinários.
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
}

export type CompartilhamentoStatus = 'ATIVO' | 'REVOGADO' | string;

export interface Compartilhamento {
  idPet: number;
  idVeterinario: number;
  status: CompartilhamentoStatus;
  dataCompartilhamento: string;
}

export interface PacienteResumo {
  idPet: number;
  nome: string;
  especie: string;
  status: string;
}

export interface PacientesPage {
  pagina: number;
  tamanho: number;
  total: number;
  dados: PacienteResumo[];
}
