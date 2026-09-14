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

// Login e cadastro devolvem o mesmo formato (UserResponse).
export interface UserResponse {
  id: number;
  email: string;
  dataNascimento: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataCadastro: string;
  statusUsuario: string;
  idTutor?: number;
}
