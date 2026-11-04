import type { CreatePetInput } from '../interfaces/pet';
import type { CreateVacinaAplicacaoInput } from '../interfaces/vacina';
import type { CreateDoencaInput, DoencaStatus } from '../interfaces/doenca';
import type { AlergiaGravidade, AlergiaTipo, CreateAlergiaInput } from '../interfaces/alergia';
import type { CreateMedicamentoInput, MedicamentoStatus } from '../interfaces/medicamento';
import type { CreateExameInput, ExameStatus } from '../interfaces/exame';
import type { ConsultaStatus, CreateConsultaInput } from '../interfaces/consulta';
import { parseBrDate } from '../utils/dateUtils';
import { fail, ok, type BuildResult } from './buildResult';
import { parseHorarios } from './reminders';

const optionalText = (value: string): string | undefined => value.trim() || undefined;

// Data opcional: vazia vira `undefined`; preenchida mas inválida é erro (e não some silenciosamente).
function optionalDate(value: string, label: string): { date?: string; error?: string } {
  if (!value.trim()) return {};
  const date = parseBrDate(value.trim());
  return date ? { date } : { error: `${label} inválida. Use dd/mm/aaaa.` };
}

function optionalPositiveNumber(value: string, label: string): { number?: number; error?: string } {
  if (!value.trim()) return {};
  const parsed = Number(value.trim().replace(',', '.'));
  return parsed > 0 ? { number: parsed } : { error: `${label} deve ser um número maior que zero.` };
}

export interface PetFormFields {
  especie: string | null;
  nome: string;
  fotoUrl: string;
  raca: string;
  dataNascimento: string;
  cor: string;
  microchip: string;
  sexo: string | null;
  castrado: boolean;
}

export function buildPetInput(fields: PetFormFields): BuildResult<CreatePetInput> {
  if (!fields.especie) return fail('Selecione a espécie do pet.');
  if (!fields.nome.trim()) return fail('Informe o nome do pet.');

  const nascimento = optionalDate(fields.dataNascimento, 'Data de nascimento');
  if (nascimento.error) return fail(nascimento.error);

  return ok({
    idEspecie: Number(fields.especie),
    nome: fields.nome.trim(),
    fotoUrl: optionalText(fields.fotoUrl),
    raca: optionalText(fields.raca),
    dataNascimento: nascimento.date,
    cor: optionalText(fields.cor),
    microchip: optionalText(fields.microchip),
    sexo: fields.sexo ?? undefined,
    castrado: fields.castrado,
  });
}

export interface VacinaFormFields {
  idVacina: string | null;
  dataAplicacao: string;
  numeroDose: string;
  numeroLote: string;
  proximaDose: string;
  clinica: string;
  observacao: string;
}

export function buildVacinaInput(fields: VacinaFormFields): BuildResult<CreateVacinaAplicacaoInput> {
  if (!fields.idVacina) return fail('Selecione a vacina.');

  const aplicacao = parseBrDate(fields.dataAplicacao.trim());
  if (!aplicacao) return fail('Informe a data de aplicação no formato dd/mm/aaaa.');

  const proxima = optionalDate(fields.proximaDose, 'Data da próxima dose');
  if (proxima.error) return fail(proxima.error);

  const dose = optionalPositiveNumber(fields.numeroDose, 'Número da dose');
  if (dose.error) return fail(dose.error);

  return ok({
    idVacina: Number(fields.idVacina),
    dataAplicacao: aplicacao,
    numeroDose: dose.number,
    numeroLote: optionalText(fields.numeroLote),
    proximaDose: proxima.date,
    clinica: optionalText(fields.clinica),
    observacao: optionalText(fields.observacao),
  });
}

export interface DoencaFormFields {
  nome: string;
  dataDiagnostico: string;
  status: string | null;
  tratamento: string;
  observacao: string;
}

export function buildDoencaInput(fields: DoencaFormFields): BuildResult<CreateDoencaInput> {
  if (!fields.nome.trim()) return fail('Informe o nome da doença.');
  if (!fields.status) return fail('Selecione o status.');

  const diagnostico = optionalDate(fields.dataDiagnostico, 'Data de diagnóstico');
  if (diagnostico.error) return fail(diagnostico.error);

  return ok({
    nome: fields.nome.trim(),
    dataDiagnostico: diagnostico.date,
    status: fields.status as DoencaStatus,
    tratamento: optionalText(fields.tratamento),
    observacao: optionalText(fields.observacao),
  });
}

export interface AlergiaFormFields {
  nome: string;
  tipo: string | null;
  dataIdentificacao: string;
  reacao: string;
  gravidade: string | null;
  observacao: string;
}

export function buildAlergiaInput(fields: AlergiaFormFields): BuildResult<CreateAlergiaInput> {
  if (!fields.nome.trim()) return fail('Informe o nome da alergia.');

  const identificacao = optionalDate(fields.dataIdentificacao, 'Data de identificação');
  if (identificacao.error) return fail(identificacao.error);

  return ok({
    nome: fields.nome.trim(),
    tipo: (fields.tipo as AlergiaTipo | null) ?? undefined,
    dataIdentificacao: identificacao.date,
    reacao: optionalText(fields.reacao),
    gravidade: (fields.gravidade as AlergiaGravidade | null) ?? undefined,
    observacao: optionalText(fields.observacao),
  });
}

export interface MedicamentoFormFields {
  nome: string;
  motivo: string;
  dosagem: string;
  unidade: string;
  frequencia: string;
  administracao: string;
  horarios: string;
  dataInicio: string;
  dataTermino: string;
  status: string | null;
  observacao: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function buildMedicamentoInput(fields: MedicamentoFormFields): BuildResult<CreateMedicamentoInput> {
  if (!fields.nome.trim()) return fail('Informe o nome do medicamento.');

  const inicio = parseBrDate(fields.dataInicio.trim());
  if (!inicio) return fail('Informe a data de início no formato dd/mm/aaaa.');

  if (!fields.status) return fail('Selecione o status.');

  const termino = optionalDate(fields.dataTermino, 'Data de término');
  if (termino.error) return fail(termino.error);
  if (termino.date && termino.date < inicio) return fail('A data de término não pode ser anterior ao início.');

  const dosagem = optionalPositiveNumber(fields.dosagem, 'Dosagem');
  if (dosagem.error) return fail(dosagem.error);

  let horario: string | undefined;
  if (fields.horarios.trim()) {
    const horarios = parseHorarios(fields.horarios);
    if (horarios.length === 0) return fail('Informe os horários no formato 08:00, 20:00.');
    horario = horarios.map(({ hour, minute }) => `${pad(hour)}:${pad(minute)}`).join(', ');
  }

  return ok({
    nome: fields.nome.trim(),
    motivo: optionalText(fields.motivo),
    dosagem: dosagem.number,
    unidade: optionalText(fields.unidade),
    frequencia: optionalText(fields.frequencia),
    administracao: optionalText(fields.administracao),
    horario,
    dataInicio: inicio,
    dataTermino: termino.date,
    status: fields.status as MedicamentoStatus,
    observacao: optionalText(fields.observacao),
  });
}

export interface ExameFormFields {
  nome: string;
  dataSolicitacao: string;
  dataRealizacao: string;
  veterinario: string;
  clinica: string;
  motivo: string;
  resultado: string;
  observacao: string;
  status: string | null;
}

export function buildExameInput(fields: ExameFormFields): BuildResult<CreateExameInput> {
  if (!fields.nome.trim()) return fail('Informe o nome do exame.');
  if (!fields.status) return fail('Selecione o status.');

  const solicitacao = optionalDate(fields.dataSolicitacao, 'Data de solicitação');
  if (solicitacao.error) return fail(solicitacao.error);

  const realizacao = optionalDate(fields.dataRealizacao, 'Data de realização');
  if (realizacao.error) return fail(realizacao.error);

  return ok({
    nome: fields.nome.trim(),
    dataSolicitacao: solicitacao.date,
    dataRealizacao: realizacao.date,
    veterinario: optionalText(fields.veterinario),
    clinica: optionalText(fields.clinica),
    motivo: optionalText(fields.motivo),
    resultado: optionalText(fields.resultado),
    observacao: optionalText(fields.observacao),
    status: fields.status as ExameStatus,
  });
}

export function buildPesoInput(text: string): BuildResult<number> {
  const peso = Number(text.trim().replace(',', '.'));
  return peso > 0 ? ok(peso) : fail('Informe um peso válido.');
}

export interface ConsultaFormFields {
  dataConsulta: string;
  horario: string;
  veterinario: string;
  clinica: string;
  motivo: string;
  sintomas: string;
  peso: string;
  diagnostico: string;
  tratamento: string;
  observacao: string;
  retorno: boolean;
  dataRetorno: string;
  status: string | null;
}

function normalizeTime(value: string): { time?: string; error?: string } {
  const text = value.trim().toLowerCase();
  if (!text) return {};

  const match = text.match(/^(\d{1,2})[:h](\d{2})$/);
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) {
    return { error: 'Informe o horário no formato 14:30.' };
  }
  return { time: `${pad(Number(match[1]))}:${match[2]}` };
}

export function buildConsultaInput(fields: ConsultaFormFields): BuildResult<CreateConsultaInput> {
  const data = parseBrDate(fields.dataConsulta.trim());
  if (!data) return fail('Informe a data da consulta no formato dd/mm/aaaa.');
  if (!fields.status) return fail('Selecione o status.');

  const horario = normalizeTime(fields.horario);
  if (horario.error) return fail(horario.error);

  const peso = optionalPositiveNumber(fields.peso, 'Peso');
  if (peso.error) return fail(peso.error);

  // A data de retorno só vale quando há retorno; ela não pode ser anterior à consulta.
  let dataRetorno: string | undefined;
  if (fields.retorno) {
    const retorno = optionalDate(fields.dataRetorno, 'Data de retorno');
    if (retorno.error) return fail(retorno.error);
    if (retorno.date && retorno.date < data) return fail('A data de retorno não pode ser anterior à consulta.');
    dataRetorno = retorno.date;
  }

  return ok({
    dataConsulta: data,
    horario: horario.time,
    veterinario: optionalText(fields.veterinario),
    clinica: optionalText(fields.clinica),
    motivo: optionalText(fields.motivo),
    sintomas: optionalText(fields.sintomas),
    peso: peso.number,
    diagnostico: optionalText(fields.diagnostico),
    tratamento: optionalText(fields.tratamento),
    observacao: optionalText(fields.observacao),
    retorno: fields.retorno,
    dataRetorno,
    status: fields.status as ConsultaStatus,
  });
}

export interface PesoFormFields {
  peso: string;
  dataMedicao: string;
}

export interface PesoEditInput {
  peso: number;
  dataMedicao: string;
}

export function buildPesoEditInput(fields: PesoFormFields): BuildResult<PesoEditInput> {
  const peso = buildPesoInput(fields.peso);
  if (!peso.ok) return peso;

  const data = parseBrDate(fields.dataMedicao.trim());
  if (!data) return fail('Informe a data da medição no formato dd/mm/aaaa.');

  return ok({ peso: peso.input, dataMedicao: `${data}T12:00:00` });
}
