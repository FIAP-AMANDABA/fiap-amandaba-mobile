import { httpRequest } from './http';

// Render (plano gratuito): a primeira chamada após inatividade pode levar dezenas de segundos.
const API_BASE_URL = 'https://fiap-amandaba-dotnet.onrender.com';

export function apiGet<TResponse>(path: string, options?: { timeoutMs?: number }): Promise<TResponse> {
  return httpRequest<TResponse>(API_BASE_URL, 'GET', path, undefined, options);
}

export function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return httpRequest<TResponse>(API_BASE_URL, 'POST', path, body);
}

export function apiPut<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return httpRequest<TResponse>(API_BASE_URL, 'PUT', path, body);
}

export function apiPatch<TResponse>(path: string, body: unknown): Promise<TResponse> {
  return httpRequest<TResponse>(API_BASE_URL, 'PATCH', path, body);
}

export function apiDelete(path: string): Promise<void> {
  return httpRequest<void>(API_BASE_URL, 'DELETE', path);
}
