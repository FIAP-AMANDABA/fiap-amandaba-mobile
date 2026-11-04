import type { ChangePasswordRequest, LoginRequest, RegisterRequest, RegisterVetRequest } from '../interfaces/auth';
import { parseBrDate } from '../utils/dateUtils';
import { fail, ok, type BuildResult } from './buildResult';
import { buildCrmv } from './profileInputs';

export function buildLoginRequest(email: string, password: string): BuildResult<LoginRequest> {
  if (!email.trim() || !password) return fail('Informe e-mail e senha.');
  return ok({ email: email.trim(), password });
}

export interface RegisterFormFields {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
}

const MIN_PASSWORD_LENGTH = 8; // exigido pela API

export function buildRegisterRequest(fields: RegisterFormFields): BuildResult<RegisterRequest> {
  if (!fields.fullName.trim() || !fields.email.trim() || !fields.password || fields.cpf.length !== 11) {
    return fail('Preencha nome, CPF (11 dígitos), e-mail e senha.');
  }
  if (fields.password.length < MIN_PASSWORD_LENGTH) {
    return fail(`A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  const dataNascimento = parseBrDate(fields.birthDate.trim());
  if (!dataNascimento) return fail('Informe a data de nascimento no formato dd/mm/aaaa.');

  return ok({
    nomeCompleto: fields.fullName.trim(),
    cpf: fields.cpf,
    dataNascimento,
    email: fields.email.trim(),
    telefone: fields.phone.trim(),
    password: fields.password,
  });
}

export function buildRegisterVetRequest(
  fields: RegisterFormFields,
  crmv: string
): BuildResult<RegisterVetRequest> {
  const base = buildRegisterRequest(fields);
  if (!base.ok) return base;

  const crmvResult = buildCrmv(crmv);
  if (!crmvResult.ok) return crmvResult;

  return ok({ ...base.input, crmv_veterinario: crmvResult.input });
}

export interface PasswordChangeFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function buildPasswordChange(fields: PasswordChangeFields): BuildResult<ChangePasswordRequest> {
  if (!fields.currentPassword) return fail('Informe a senha atual.');
  if (fields.newPassword.length < MIN_PASSWORD_LENGTH) {
    return fail(`A nova senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  if (fields.newPassword === fields.currentPassword) return fail('A nova senha deve ser diferente da atual.');
  if (fields.newPassword !== fields.confirmPassword) return fail('A confirmação não confere com a nova senha.');

  return ok({ senhaAtual: fields.currentPassword, novaSenha: fields.newPassword });
}
