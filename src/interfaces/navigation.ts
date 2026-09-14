export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  TutorRoot: undefined;
};

// Sem consultas por enquanto — volta quando essa área for implementada.
export type TutorTabParamList = {
  Inicio: undefined;
  Pets: undefined;
  Cuidados: undefined;
  Perfil: undefined;
};

export type PetsStackParamList = {
  PetsList: undefined;
  PetForm: { petId: number } | undefined;
  PetDetail: { petId: number };
};

export type CuidadosStackParamList = {
  CuidadosPicker: undefined;
  CuidadosPlano: { petId: number };
};
