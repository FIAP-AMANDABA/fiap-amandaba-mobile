export interface Doenca {
  idRegistroDoenca: number;
  idPet: number;
  nome: string;
  dataDiagnostico: string | null;
  status: string;
  tratamento: string | null;
  observacao: string | null;
  dataCadastro: string;
}

export type DoencaStatus = 'ATIVA' | 'CONTROLADA' | 'ENCERRADA';

export interface CreateDoencaInput {
  nome: string;
  dataDiagnostico?: string;
  status: DoencaStatus;
  tratamento?: string;
  observacao?: string;
}
