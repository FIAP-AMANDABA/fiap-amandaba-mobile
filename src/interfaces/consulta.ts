// Espelha ConsultaResponseDto / ConsultaRequestDto (fiap-amandaba-dotnet-sprint4)

export type ConsultaStatus = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export interface Consulta {
  idConsulta: number;
  idPet: number;
  dataConsulta: string;
  horario: string | null;
  veterinario: string | null;
  clinica: string | null;
  motivo: string | null;
  sintomas: string | null;
  peso: number | null;
  diagnostico: string | null;
  tratamento: string | null;
  observacao: string | null;
  retorno: boolean;
  dataRetorno: string | null;
  status: ConsultaStatus | string;
  dataCadastro: string;
}

export interface CreateConsultaInput {
  dataConsulta: string;
  horario?: string;
  veterinario?: string;
  clinica?: string;
  motivo?: string;
  sintomas?: string;
  peso?: number;
  diagnostico?: string;
  tratamento?: string;
  observacao?: string;
  retorno: boolean;
  dataRetorno?: string;
  status: ConsultaStatus;
}
