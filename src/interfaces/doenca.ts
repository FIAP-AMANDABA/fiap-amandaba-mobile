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
