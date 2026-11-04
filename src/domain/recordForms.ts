import type { VacinaAplicacao } from '../interfaces/vacina';
import type { Doenca } from '../interfaces/doenca';
import type { Alergia } from '../interfaces/alergia';
import type { Medicamento } from '../interfaces/medicamento';
import type { Exame } from '../interfaces/exame';
import type { Consulta } from '../interfaces/consulta';
import type { Peso } from '../interfaces/peso';
import { formatDateBr } from '../utils/dateUtils';
import type {
  AlergiaFormFields,
  ConsultaFormFields,
  DoencaFormFields,
  ExameFormFields,
  MedicamentoFormFields,
  PesoFormFields,
  VacinaFormFields,
} from './recordInputs';

const text = (value: string | number | null | undefined): string => (value == null ? '' : String(value));
const brDate = (iso: string | null | undefined): string => (iso ? formatDateBr(iso) : '');
const decimal = (value: number | null | undefined): string => text(value).replace('.', ',');

export function vacinaToFields(vacina: VacinaAplicacao): VacinaFormFields {
  return {
    idVacina: String(vacina.vacina.idVacina),
    dataAplicacao: brDate(vacina.dataAplicacao),
    numeroDose: text(vacina.numeroDose),
    numeroLote: text(vacina.numeroLote),
    proximaDose: brDate(vacina.proximaDose),
    clinica: text(vacina.clinica),
    observacao: text(vacina.observacao),
  };
}

export function doencaToFields(doenca: Doenca): DoencaFormFields {
  return {
    nome: doenca.nome,
    dataDiagnostico: brDate(doenca.dataDiagnostico),
    status: doenca.status,
    tratamento: text(doenca.tratamento),
    observacao: text(doenca.observacao),
  };
}

export function alergiaToFields(alergia: Alergia): AlergiaFormFields {
  return {
    nome: alergia.nome,
    tipo: alergia.tipo,
    dataIdentificacao: brDate(alergia.dataIdentificacao),
    reacao: text(alergia.reacao),
    gravidade: alergia.gravidade,
    observacao: text(alergia.observacao),
  };
}

export function medicamentoToFields(medicamento: Medicamento): MedicamentoFormFields {
  return {
    nome: medicamento.nome,
    motivo: text(medicamento.motivo),
    dosagem: decimal(medicamento.dosagem),
    unidade: text(medicamento.unidade),
    frequencia: text(medicamento.frequencia),
    administracao: text(medicamento.administracao),
    horarios: text(medicamento.horario),
    dataInicio: brDate(medicamento.dataInicio),
    dataTermino: brDate(medicamento.dataTermino),
    status: medicamento.status,
    observacao: text(medicamento.observacao),
  };
}

export function exameToFields(exame: Exame): ExameFormFields {
  return {
    nome: exame.nome,
    dataSolicitacao: brDate(exame.dataSolicitacao),
    dataRealizacao: brDate(exame.dataRealizacao),
    veterinario: text(exame.veterinario),
    clinica: text(exame.clinica),
    motivo: text(exame.motivo),
    resultado: text(exame.resultado),
    observacao: text(exame.observacao),
    status: exame.status,
  };
}

export function consultaToFields(consulta: Consulta): ConsultaFormFields {
  return {
    dataConsulta: brDate(consulta.dataConsulta),
    horario: text(consulta.horario),
    veterinario: text(consulta.veterinario),
    clinica: text(consulta.clinica),
    motivo: text(consulta.motivo),
    sintomas: text(consulta.sintomas),
    peso: decimal(consulta.peso),
    diagnostico: text(consulta.diagnostico),
    tratamento: text(consulta.tratamento),
    observacao: text(consulta.observacao),
    retorno: consulta.retorno,
    dataRetorno: brDate(consulta.dataRetorno),
    status: consulta.status,
  };
}

export function pesoToFields(peso: Peso): PesoFormFields {
  return { peso: decimal(peso.peso), dataMedicao: brDate(peso.dataMedicao) };
}
