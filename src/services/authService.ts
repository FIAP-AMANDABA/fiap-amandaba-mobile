import type {
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RegisterRequest,
  RegisterVetRequest,
} from '../interfaces/auth';
import { httpRequest } from './http';
import { JAVA_API_BASE_URL } from './javaApi';

export function login(data: LoginRequest): Promise<AuthResponse> {
  return httpRequest<AuthResponse>(JAVA_API_BASE_URL, 'POST', '/api/auth/login', data);
}

export function registerTutor(data: RegisterRequest): Promise<ProfileResponse> {
  return httpRequest<ProfileResponse>(JAVA_API_BASE_URL, 'POST', '/api/auth/register/tutor', data);
}

export function registerVeterinario(data: RegisterVetRequest): Promise<ProfileResponse> {
  return httpRequest<ProfileResponse>(JAVA_API_BASE_URL, 'POST', '/api/auth/register/vet', data);
}
