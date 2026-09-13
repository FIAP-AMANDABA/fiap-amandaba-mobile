// TutorEntity/UsuarioEntity (fiap-amandaba-dotnet) ainda não têm um endpoint
// que resolva o tutor a partir do usuário logado. Formato provisório, espelhando
// os campos de UsuarioEntity que existirão nesse perfil (Nome, Cpf, Email, Telefone,
// DataNascimento) unidos ao TutorEntity (IdTutor, IdUsuario).

export interface Tutor {
  idTutor: number;
  idUsuario: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
}
