import { getAuthToken, notifyUnauthorized } from './authToken';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function defaultMessage(status: number): string {
  if (status === 404) return 'Registro não encontrado.';
  if (status === 400) return 'Dados inválidos. Revise as informações e tente novamente.';
  if (status >= 500) return 'O servidor não conseguiu concluir a operação. Tente novamente em instantes.';
  return 'Não foi possível concluir a operação.';
}

async function toApiError(response: Response): Promise<ApiError> {
  let detail: string | undefined;

  try {
    const body = await response.json();
    // .NET responde `mensagem`; o Java responde `erro` (e `detalhe` nas validações, que é técnico).
    detail = body?.mensagem ?? body?.message ?? (response.status === 400 ? undefined : body?.erro);
  } catch {
    // corpo vazio ou não-JSON: usa a mensagem padrão do status
  }

  return new ApiError(response.status, typeof detail === 'string' && detail ? detail : defaultMessage(response.status));
}

export async function httpRequest<TResponse>(
  baseUrl: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  options: { timeoutMs?: number } = {}
): Promise<TResponse> {
  let response: Response;

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  // Chamadas lentas (como a geração de texto por IA) podem pedir um limite de tempo próprio.
  const controller = options.timeoutMs ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), options.timeoutMs) : null;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller?.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(0, 'O servidor demorou mais que o esperado para responder. Tente novamente.');
    }
    throw new ApiError(0, 'Sem conexão com o servidor. Verifique sua internet e tente novamente.');
  } finally {
    if (timer) clearTimeout(timer);
  }

  // 401 com token enviado = sessão expirada ou revogada (no login não há token, então não cai aqui).
  if (response.status === 401 && token) {
    notifyUnauthorized();
    throw new ApiError(401, 'Sua sessão expirou. Entre novamente.');
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json();
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
