import type { UpdateProfileRequest } from '../interfaces/auth';
import { parseApiDate, parseBrDate } from '../utils/dateUtils';
import { fail, ok, type BuildResult } from './buildResult';

export interface ProfileFormFields {
  nomeCompleto: string;
  email: string; // não editável: vem do cadastro e é reenviado como está
  telefone: string;
  dataNascimento: string;
}

const MAX_NAME_LENGTH = 150;

export function buildProfileUpdate(fields: ProfileFormFields): BuildResult<UpdateProfileRequest> {
  const nome = fields.nomeCompleto.trim();
  if (!nome) return fail('Informe o nome completo.');
  if (nome.length > MAX_NAME_LENGTH) return fail(`O nome pode ter no máximo ${MAX_NAME_LENGTH} caracteres.`);

  const telefone = fields.telefone.replace(/\D/g, '');
  if (telefone.length < 10 || telefone.length > 11) {
    return fail('Informe o telefone com DDD (10 ou 11 dígitos).');
  }

  const nascimento = parseBrDate(fields.dataNascimento.trim());
  const parsed = parseApiDate(nascimento);
  // `Date` aceita 31/02 e vira março: comparar de volta rejeita datas que não existem.
  if (!nascimento || !parsed || nascimento !== toIsoDate(parsed)) {
    return fail('Informe a data de nascimento no formato dd/mm/aaaa.');
  }
  if (parsed.getTime() >= startOfToday().getTime()) return fail('A data de nascimento deve estar no passado.');

  return ok({ nomeCompleto: nome, email: fields.email, telefone, dataNascimento: nascimento });
}

export interface ProfileSubmission {
  profile: UpdateProfileRequest;
  crmv?: string; // só veterinário, e só quando mudou
}

// O CRMV só é enviado quando mudou: a API o trata em rota própria.
export function buildProfileSubmission(
  fields: ProfileFormFields,
  vet: { isVet: boolean; crmv: string; currentCrmv: string | null }
): BuildResult<ProfileSubmission> {
  const profile = buildProfileUpdate(fields);
  if (!profile.ok) return profile;
  if (!vet.isVet) return ok({ profile: profile.input });

  const crmv = buildCrmv(vet.crmv);
  if (!crmv.ok) return crmv;

  const changed = crmv.input !== (vet.currentCrmv ?? '').trim().toUpperCase();
  return ok({ profile: profile.input, crmv: changed ? crmv.input : undefined });
}

const MAX_CRMV_LENGTH = 20; // limite da API

// Só se exige que o CRMV seja informado (costuma vir com UF: "CRMV-SP 12345").
export function buildCrmv(value: string): BuildResult<string> {
  const crmv = value.trim().toUpperCase();
  if (!crmv) return fail('Informe o CRMV.');
  if (crmv.length > MAX_CRMV_LENGTH) return fail(`O CRMV pode ter no máximo ${MAX_CRMV_LENGTH} caracteres.`);
  return ok(crmv);
}

function toIsoDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
