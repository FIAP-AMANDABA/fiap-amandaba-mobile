// Espelha os DTOs do backend Java (br.com.fiap.amandaba.dto).

export type UserRole = 'TUTOR' | 'VETERINARIO';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  password: string;
}

// A API chama o campo de `crmv_veterinario`.
export interface RegisterVetRequest extends RegisterRequest {
  crmv_veterinario: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  perfil: UserRole | string;
  idUsuario: number;
  idPerfil: number;
}

// O e-mail é obrigatório na API; o app reenvia o atual (trocá-lo invalidaria o token).
export interface UpdateProfileRequest {
  nomeCompleto: string;
  email: string;
  telefone: string;
  dataNascimento: string;
}

export interface UpdateCrmvRequest {
  crmv: string;
}

export interface ProfileResponse {
  idUser: number;
  email: string;
  nomeCompleto: string;
  cpf: string;
  dataCadastro: string;
  dataNascimento: string | null;
  telefone: string | null;
  statusUsuario: string;
  idTutor?: number;
  idVeterinario?: number;
  crmv?: string;
}

export interface Session {
  token: string;
  userId: number;
  role: UserRole;
  profileId: number;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}
