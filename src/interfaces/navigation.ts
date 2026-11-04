import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ReminderTab } from './reminder';

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: { expired?: boolean } | undefined;
  TutorRoot: NavigatorScreenParams<TutorTabParamList> | undefined;
  VetRoot: NavigatorScreenParams<VetTabParamList> | undefined;
};

export type VetTabParamList = {
  Pacientes: NavigatorScreenParams<PetsStackParamList> | undefined;
  Perfil: undefined;
};

export type TutorTabParamList = {
  Inicio: NavigatorScreenParams<InicioStackParamList> | undefined;
  Pets: NavigatorScreenParams<PetsStackParamList> | undefined;
  Cuidados: undefined;
  Perfil: undefined;
};

export type InicioStackParamList = {
  Home: undefined;
  Lembretes: undefined;
};

export type PetsStackParamList = {
  PetsList: undefined;
  PetForm: { petId: number } | undefined;
  PetDetail: { petId: number; initialTab?: ReminderTab };
};

export type CuidadosStackParamList = {
  CuidadosPicker: undefined;
  CuidadosPlano: { petId: number };
};

export type PerfilStackParamList = {
  PerfilHome: undefined;
  EditarPerfil: undefined;
  AlterarSenha: undefined;
  Sobre: undefined;
};
