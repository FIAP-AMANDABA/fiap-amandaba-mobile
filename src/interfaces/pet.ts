// Espelha PetResponseDto em Amandaba.API/Application/Dtos/Pets (fiap-amandaba-dotnet)

export interface Pet {
  idPet: number;
  idTutor: number;
  idEspecie: number;
  especie: string;
  nome: string;
  fotoUrl: string | null;
  raca: string | null;
  sexo: string | null;
  dataNascimento: string | null;
  cor: string | null;
  castrado: boolean;
  microchip: string | null;
  dataCadastro: string;
  status: string;
}

export interface CreatePetInput {
  idEspecie: number;
  nome: string;
  fotoUrl?: string;
  raca?: string;
  sexo?: string;
  dataNascimento?: string;
  cor?: string;
  castrado: boolean;
  microchip?: string;
}
