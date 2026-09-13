// Espelha MedicamentoResponseDto (fiap-amandaba-dotnet)

export type MedicamentoStatus = 'EM_USO' | 'CONCLUIDO' | 'SUSPENSO';

export interface Medicamento {
  idRegistroMedicamento: number;
  idPet: number;
  nome: string;
  motivo: string | null;
  dosagem: number | null;
  unidade: string | null;
  quantidade: string | null;
  frequencia: string | null;
  administracao: string | null;
  horario: string | null;
  dataInicio: string;
  dataTermino: string | null;
  status: MedicamentoStatus | string;
  prescricao: string | null;
  observacao: string | null;
  dataCadastro: string;
}
