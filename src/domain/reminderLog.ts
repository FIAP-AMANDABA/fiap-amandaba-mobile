import type { ReminderLogEntry, ReminderPlan } from '../interfaces/reminder';

export const MAX_HISTORY_ENTRIES = 50;

export function planToLogEntry(plan: ReminderPlan): ReminderLogEntry {
  return {
    id: plan.id,
    title: plan.title,
    body: plan.body,
    at: plan.fireAt.toISOString(),
    data: plan.data,
  };
}

// O sistema não informa o que foi entregue: o que estava agendado e já passou da hora conta como disparado.
export function archiveDueReminders(
  scheduled: ReminderLogEntry[],
  history: ReminderLogEntry[],
  now: Date
): ReminderLogEntry[] {
  const due = scheduled.filter((entry) => new Date(entry.at).getTime() <= now.getTime());

  const byId = new Map<string, ReminderLogEntry>();
  for (const entry of [...due, ...history]) {
    if (!byId.has(entry.id)) byId.set(entry.id, entry);
  }

  return [...byId.values()].sort((a, b) => b.at.localeCompare(a.at)).slice(0, MAX_HISTORY_ENTRIES);
}

export function upcomingReminders(plans: ReminderPlan[], now: Date): ReminderPlan[] {
  return plans
    .filter((plan) => plan.fireAt.getTime() > now.getTime())
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
}

export function remindersLeftToday(plans: ReminderPlan[], now: Date): number {
  const sameDay = (date: Date) =>
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  return plans.filter((plan) => plan.fireAt.getTime() > now.getTime() && sameDay(plan.fireAt)).length;
}
