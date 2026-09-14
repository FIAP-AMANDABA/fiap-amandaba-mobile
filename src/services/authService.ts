import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginRequest, RegisterRequest, UserResponse } from '../interfaces/auth';

// Publicada no Render — free tier "dorme" sem tráfego; a 1ª chamada após inatividade
// pode levar dezenas de segundos até o serviço acordar.
const API_BASE_URL = 'https://fiap-amandaba-java.onrender.com';

const STORAGE_KEY = 'amandaba:currentUserId';

// Id do usuário autenticado, guardado em memória e persistido no dispositivo
// (AsyncStorage) para o usuário não precisar logar de novo toda vez que reabrir o app.
let currentUserId: number | null = null;

async function request(path: string, method: string, body: unknown): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return response.json();
}

async function setCurrentUserId(id: number): Promise<void> {
  currentUserId = id;
  await AsyncStorage.setItem(STORAGE_KEY, String(id));
}

export async function login(data: LoginRequest): Promise<UserResponse> {
  const user = await request('/api/auth/login', 'POST', data);
  await setCurrentUserId(user.id);
  return user;
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const user = await request('/api/auth/register', 'POST', data);
  await setCurrentUserId(user.id);
  return user;
}

export function getCurrentUserId(): number | null {
  return currentUserId;
}

// Chamado uma vez, na inicialização do app, para restaurar a sessão salva.
export async function restoreSession(): Promise<number | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  currentUserId = stored ? Number(stored) : null;
  return currentUserId;
}

export async function logout(): Promise<void> {
  currentUserId = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}
