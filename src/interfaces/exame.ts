export interface Exame {
  idExame: number;
  idPet: number;
  nome: string;
  dataSolicitacao: string | null;
  dataRealizacao: string | null;
  veterinario: string | null;
  clinica: string | null;
  motivo: string | null;
  resultado: string | null;
  observacao: string | null;
  arquivo: string | null;
  status: string;
  dataCadastro: string;
}

export type ExameStatus = 'SOLICITADO' | 'REALIZADO' | 'RESULTADO_DISPONIVEL';

export interface CreateExameInput {
  nome: string;
  dataSolicitacao?: string;
  dataRealizacao?: string;
  veterinario?: string;
  clinica?: string;
  motivo?: string;
  resultado?: string;
  observacao?: string;
  arquivo?: string;
  status: ExameStatus;
}
