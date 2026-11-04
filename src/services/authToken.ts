// Token da sessão em memória, lido pelo cliente HTTP a cada requisição.
let token: string | null = null;
let unauthorizedHandler: (() => void) | null = null;
let expiryNotified = false;

export function setAuthToken(next: string | null): void {
  token = next;
  expiryNotified = false;
}

export function getAuthToken(): string | null {
  return token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  if (expiryNotified) return;
  expiryNotified = true;
  unauthorizedHandler?.();
}
