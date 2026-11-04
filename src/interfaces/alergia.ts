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

export type AlergiaTipo = 'MEDICAMENTO' | 'ALIMENTO' | 'AMBIENTAL' | 'OUTRO';
export type AlergiaGravidade = 'LEVE' | 'MODERADA' | 'GRAVE';

export interface CreateAlergiaInput {
  nome: string;
  tipo?: AlergiaTipo;
  dataIdentificacao?: string;
  reacao?: string;
  gravidade?: AlergiaGravidade;
  observacao?: string;
}
