// Espelha os DTOs de br.com.fiap.amandaba.dto no backend
// (https://github.com/FIAP-AMANDABA/fiap-amandaba-java), endpoints /api/auth/register e /api/auth/login.

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string; // ISO "yyyy-MM-dd"
  email: string;
  telefone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
