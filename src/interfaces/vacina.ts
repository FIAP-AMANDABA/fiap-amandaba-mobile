// Espelha VacinaAplicacaoResponseDto / VacinaCatalogoResponseDto (fiap-amandaba-dotnet)

export interface VacinaCatalogo {
  idVacina: number;
  nome: string;
  tipo: string | null;
  fabricante: string | null;
  descricao: string | null;
}

export interface VacinaAplicacao {
  idAplicacaoVacina: number;
  idPet: number;
  vacina: VacinaCatalogo;
  dataAplicacao: string;
  numeroDose: number | null;
  numeroLote: string | null;
  proximaDose: string | null;
  situacao: string | null;
  clinica: string | null;
  observacao: string | null;
  comprovante: string | null;
  dataCadastro: string;
}
