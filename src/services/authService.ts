import type { LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/auth';

// Publicada no Render — free tier "dorme" sem tráfego; a 1ª chamada após inatividade
// pode levar dezenas de segundos até o serviço acordar.
const API_BASE_URL = 'https://fiap-amandaba-java.onrender.com';

async function request<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  // /register responde com texto puro ("User registered"), não JSON — só /login
  // devolve um objeto de verdade.
  const text = await response.text();
  if (!text) return undefined as TResponse;
  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return text as unknown as TResponse;
  }
}

export function login(data: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', data);
}

export function register(data: RegisterRequest): Promise<void> {
  return request<void>('/api/auth/register', data);
}
