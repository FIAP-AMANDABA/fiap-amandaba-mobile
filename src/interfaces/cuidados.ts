// Espelha o retorno de GET /api/pets/{petId}/plano-cuidados (PetsController, fiap-amandaba-dotnet)
export interface PlanoCuidados {
  petId: number;
  nome: string;
  especie: string;
  planoGerado: string;
}
