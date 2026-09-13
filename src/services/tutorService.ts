import type { Tutor } from '../interfaces/tutor';

// TODO: não existe endpoint em fiap-amandaba-dotnet para resolver o tutor a partir
// do usuário autenticado (sem TutoresController/UsuariosController). Substituir
// assim que essa ponte entre a API de auth e a API de domínio existir.
export async function getCurrentTutor(): Promise<Tutor | null> {
  return null;
}
