export interface Alergia {
  idRegistroAlergia: number;
  idPet: number;
  nome: string;
  tipo: string | null;
  dataIdentificacao: string | null;
  reacao: string | null;
  gravidade: string | null;
  observacao: string | null;
  dataCadastro: string;
}
