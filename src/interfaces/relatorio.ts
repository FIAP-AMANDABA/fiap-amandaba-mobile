// Espelha RelatorioPetResponse (fiap-amandaba-java): indicadores de saúde de cada pet ativo.
export interface RelatorioPet {
  idPet: number;
  nomePet: string;
  especie: string;
  idadeAnos: number | null;
  doencasAtivas: number;
  medicamentosEmUso: number;
  vacinasAtrasadas: number;
  consultasRegistradas: number;
}
