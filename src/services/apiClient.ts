// Cliente para a API de domínio (fiap-amandaba-dotnet), separada da API de auth (fiap-amandaba-java).
// Publicada no Render — free tier "dorme" sem tráfego; a 1ª chamada após inatividade
// pode levar dezenas de segundos até o serviço acordar.
const API_BASE_URL = 'https://fiap-amandaba-dotnet.onrender.com';

async function parseResponse<TResponse>(response: Response, method: string, path: string): Promise<TResponse> {
  if (!response.ok) {
    throw new Error(`${method} ${path} failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json();
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return parseResponse<TResponse>(response, 'GET', path);
}

export async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse<TResponse>(response, 'POST', path);
}

export async function apiPut<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse<TResponse>(response, 'PUT', path);
}

export async function apiPatch<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse<TResponse>(response, 'PATCH', path);
}
