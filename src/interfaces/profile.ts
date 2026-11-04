import type { UserRole } from './auth';

export interface UserProfile {
  userId: number;
  profileId: number;
  role: UserRole;
  nome: string;
  cpf: string;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
  crmv: string | null;
}
