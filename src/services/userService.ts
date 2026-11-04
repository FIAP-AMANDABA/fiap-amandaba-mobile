import type {
  ChangePasswordRequest,
  ProfileResponse,
  UpdateCrmvRequest,
  UpdateProfileRequest,
  UserRole,
} from '../interfaces/auth';
import type { UserProfile } from '../interfaces/profile';
import { httpRequest } from './http';
import { JAVA_API_BASE_URL } from './javaApi';

// Rotas sem id: atuam sempre sobre o usuário do token.
function toUserProfile(profile: ProfileResponse): UserProfile {
  const role: UserRole = profile.idVeterinario !== undefined ? 'VETERINARIO' : 'TUTOR';

  return {
    userId: profile.idUser,
    profileId: (role === 'VETERINARIO' ? profile.idVeterinario : profile.idTutor) as number,
    role,
    nome: profile.nomeCompleto,
    cpf: profile.cpf,
    email: profile.email,
    telefone: profile.telefone,
    dataNascimento: profile.dataNascimento,
    crmv: profile.crmv ?? null,
  };
}

export async function getMyProfile(): Promise<UserProfile> {
  return toUserProfile(await httpRequest<ProfileResponse>(JAVA_API_BASE_URL, 'GET', '/api/usuarios/me'));
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  return toUserProfile(await httpRequest<ProfileResponse>(JAVA_API_BASE_URL, 'PUT', '/api/usuarios/me', data));
}

export async function updateMyCrmv(data: UpdateCrmvRequest): Promise<void> {
  await httpRequest<unknown>(JAVA_API_BASE_URL, 'PUT', '/api/veterinarios/me/crmv', data);
}

// A API desativa a conta (não apaga): os dados são preservados e o login deixa de funcionar.
export function deactivateMyAccount(): Promise<void> {
  return httpRequest<void>(JAVA_API_BASE_URL, 'DELETE', '/api/usuarios/me');
}

export async function changeMyPassword(data: ChangePasswordRequest): Promise<void> {
  await httpRequest<void>(JAVA_API_BASE_URL, 'PUT', '/api/usuarios/me/senha', data);
}
