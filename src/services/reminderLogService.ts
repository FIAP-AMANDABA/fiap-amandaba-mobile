import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReminderLogEntry } from '../interfaces/reminder';

const SCHEDULED_KEY = 'amandaba:reminders:scheduled';
const HISTORY_KEY = 'amandaba:reminders:history';

async function loadList(key: string): Promise<ReminderLogEntry[]> {
  const stored = await AsyncStorage.getItem(key);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as ReminderLogEntry[]) : [];
  } catch {
    return [];
  }
}

export const loadScheduledSnapshot = () => loadList(SCHEDULED_KEY);
export const loadReminderHistory = () => loadList(HISTORY_KEY);

export function saveScheduledSnapshot(entries: ReminderLogEntry[]): Promise<void> {
  return AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(entries));
}

export function saveReminderHistory(entries: ReminderLogEntry[]): Promise<void> {
  return AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export async function clearReminderLog(): Promise<void> {
  await AsyncStorage.multiRemove([SCHEDULED_KEY, HISTORY_KEY]);
}
