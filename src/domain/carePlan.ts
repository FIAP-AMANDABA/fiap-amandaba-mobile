import { fail, ok, type BuildResult } from './buildResult';

// A API devolve o erro do serviço de IA como se fosse o plano (HTTP 200); aqui ele vira erro de verdade.
const AI_ERROR = /^\s*Erro\s+\d{3}\b/i;
const QUOTA_ERROR = /\b429\b|RESOURCE_EXHAUSTED|quota/i;

export function validateCarePlanText(text: string | null | undefined): BuildResult<string> {
  const plan = (text ?? '').trim();

  if (!plan) return fail('O serviço de IA não retornou um plano. Tente novamente em instantes.');

  if (AI_ERROR.test(plan)) {
    return fail(
      QUOTA_ERROR.test(plan)
        ? 'O limite de uso da IA foi atingido. Tente novamente mais tarde.'
        : 'O serviço de IA está indisponível no momento. Tente novamente em instantes.'
    );
  }

  return ok(plan);
}
