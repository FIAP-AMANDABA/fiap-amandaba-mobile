import type { Pet } from '../interfaces/pet';
import type { VacinaAplicacao } from '../interfaces/vacina';
import type { Medicamento } from '../interfaces/medicamento';
import type { Consulta } from '../interfaces/consulta';
import type { ReminderPlan } from '../interfaces/reminder';
import { parseApiDate } from '../utils/dateUtils';

const VACCINE_REMINDER_HOUR = 9;
// Medicamentos são agendados dia a dia numa janela curta, renovada a cada abertura do app.
const MEDICATION_HORIZON_DAYS = 7;
const CONSULTA_EVE_HOUR = 9;
const CONSULTA_NO_TIME_HOUR = 8;
const CONSULTA_LEAD_MINUTES = 60;
// iOS aceita no máximo 64 notificações locais agendadas.
export const MAX_SCHEDULED_REMINDERS = 60;

export interface TimeOfDay {
  hour: number;
  minute: number;
}

const pad = (value: number) => String(value).padStart(2, '0');

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const dayKey = (date: Date) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

// O "h" só vale como separador fora de palavras ("12 horas" é ignorado).
export function parseHorarios(text: string | null | undefined): TimeOfDay[] {
  if (!text) return [];

  const found = new Map<string, TimeOfDay>();
  const pattern = /\b([01]?\d|2[0-3])\s*(?::|[hH](?![A-Za-zÀ-ÿ]))\s*([0-5]\d)?/g;

  for (const match of text.matchAll(pattern)) {
    const hour = Number(match[1]);
    const minute = match[2] ? Number(match[2]) : 0;
    found.set(`${pad(hour)}:${pad(minute)}`, { hour, minute });
  }

  return [...found.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, time]) => time);
}

export function planVaccineReminders(
  pets: Pet[],
  vacinasPorPet: VacinaAplicacao[][],
  now: Date
): ReminderPlan[] {
  const plans: ReminderPlan[] = [];

  pets.forEach((pet, index) => {
    for (const aplicacao of vacinasPorPet[index] ?? []) {
      const doseDay = parseApiDate(aplicacao.proximaDose);
      if (!doseDay) continue;

      const dayBefore = addDays(doseDay, -1);
      const label = `${pad(doseDay.getDate())}/${pad(doseDay.getMonth() + 1)}`;
      const at = (day: Date) =>
        new Date(day.getFullYear(), day.getMonth(), day.getDate(), VACCINE_REMINDER_HOUR, 0);

      const data = { petId: pet.idPet, tab: 'vacinas' as const };

      if (at(dayBefore) > now) {
        plans.push({
          id: `vacina-${aplicacao.idAplicacaoVacina}-1d`,
          title: `Vacina amanhã · ${pet.nome}`,
          body: `A dose de ${aplicacao.vacina.nome} está marcada para amanhã (${label}).`,
          fireAt: at(dayBefore),
          data,
        });
      }

      if (at(doseDay) > now) {
        plans.push({
          id: `vacina-${aplicacao.idAplicacaoVacina}-0d`,
          title: `Vacina hoje · ${pet.nome}`,
          body: `Hoje é dia da dose de ${aplicacao.vacina.nome}.`,
          fireAt: at(doseDay),
          data,
        });
      }
    }
  });

  return plans;
}

export function planMedicationReminders(
  pets: Pet[],
  medicamentosPorPet: Medicamento[][],
  now: Date
): ReminderPlan[] {
  const plans: ReminderPlan[] = [];
  const today = startOfDay(now);

  pets.forEach((pet, index) => {
    for (const medicamento of medicamentosPorPet[index] ?? []) {
      if (medicamento.status !== 'EM_USO') continue;

      const horarios = parseHorarios(medicamento.horario);
      if (horarios.length === 0) continue;

      const start = parseApiDate(medicamento.dataInicio);
      const end = parseApiDate(medicamento.dataTermino);
      const dose = medicamento.dosagem
        ? ` · ${medicamento.dosagem} ${medicamento.unidade ?? ''}`.trimEnd()
        : '';

      for (let offset = 0; offset < MEDICATION_HORIZON_DAYS; offset++) {
        const day = addDays(today, offset);
        if (start && day < start) continue;
        if (end && day > end) break;

        for (const { hour, minute } of horarios) {
          const fireAt = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
          if (fireAt <= now) continue;

          plans.push({
            id: `medicamento-${medicamento.idRegistroMedicamento}-${dayKey(day)}-${pad(hour)}${pad(minute)}`,
            title: `Hora do remédio · ${pet.nome}`,
            body: `${medicamento.nome}${dose}`,
            fireAt,
            data: { petId: pet.idPet, tab: 'clinico' },
          });
        }
      }
    }
  });

  return plans;
}

export function planConsultaReminders(
  pets: Pet[],
  consultasPorPet: Consulta[][],
  now: Date
): ReminderPlan[] {
  const plans: ReminderPlan[] = [];

  pets.forEach((pet, index) => {
    for (const consulta of consultasPorPet[index] ?? []) {
      if (consulta.status !== 'AGENDADA') continue;

      const day = parseApiDate(consulta.dataConsulta);
      if (!day) continue;

      const [time] = parseHorarios(consulta.horario);
      const appointment = new Date(day.getFullYear(), day.getMonth(), day.getDate(), time?.hour ?? 0, time?.minute ?? 0);
      const where = consulta.veterinario ? ` com ${consulta.veterinario}` : '';
      const label = `${pad(day.getDate())}/${pad(day.getMonth() + 1)}`;
      const at = time ? ` às ${pad(time.hour)}:${pad(time.minute)}` : '';
      const data = { petId: pet.idPet, tab: 'consultas' as const };

      const eve = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1, CONSULTA_EVE_HOUR, 0);
      if (eve > now) {
        plans.push({
          id: `consulta-${consulta.idConsulta}-1d`,
          title: `Consulta amanhã · ${pet.nome}`,
          body: `Consulta${where} marcada para amanhã (${label})${at}.`,
          fireAt: eve,
          data,
        });
      }

      const sameDay = time
        ? new Date(appointment.getTime() - CONSULTA_LEAD_MINUTES * 60_000)
        : new Date(day.getFullYear(), day.getMonth(), day.getDate(), CONSULTA_NO_TIME_HOUR, 0);
      if (sameDay > now) {
        plans.push({
          id: `consulta-${consulta.idConsulta}-0d`,
          title: `Consulta hoje · ${pet.nome}`,
          body: time
            ? `Sua consulta${where} é hoje${at}.`
            : `Você tem uma consulta${where} hoje.`,
          fireAt: sameDay,
          data,
        });
      }
    }
  });

  return plans;
}

export function buildReminderPlans(input: {
  pets: Pet[];
  vacinasPorPet: VacinaAplicacao[][];
  medicamentosPorPet: Medicamento[][];
  consultasPorPet: Consulta[][];
  now: Date;
}): ReminderPlan[] {
  return [
    ...planVaccineReminders(input.pets, input.vacinasPorPet, input.now),
    ...planMedicationReminders(input.pets, input.medicamentosPorPet, input.now),
    ...planConsultaReminders(input.pets, input.consultasPorPet, input.now),
  ]
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
    .slice(0, MAX_SCHEDULED_REMINDERS);
}
