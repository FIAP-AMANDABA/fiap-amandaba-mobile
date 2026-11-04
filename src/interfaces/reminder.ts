export type ReminderTab = 'vacinas' | 'clinico' | 'consultas';

// Dados anexados à notificação: dizem para qual tela do app ela deve levar.
export interface ReminderData {
  petId: number;
  tab: ReminderTab;
}

export interface ReminderPlan {
  id: string;
  title: string;
  body: string;
  fireAt: Date;
  data: ReminderData;
}

export type NotificationPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

export interface ReminderStatus {
  permission: NotificationPermission;
  scheduledCount: number;
}

export interface ReminderLogEntry {
  id: string;
  title: string;
  body: string;
  at: string;
  data: ReminderData;
}
