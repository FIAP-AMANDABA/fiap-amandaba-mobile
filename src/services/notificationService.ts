import { Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type {
  NotificationPermission,
  ReminderData,
  ReminderPlan,
  ReminderStatus,
} from '../interfaces/reminder';
import { clearReminderLog } from './reminderLogService';

const CHANNEL_ID = 'lembretes';
const isSupported = Platform.OS !== 'web';

export function configureNotificationHandler(): void {
  if (!isSupported) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Lembretes de saúde',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export function openSystemSettings(): Promise<void> {
  return Linking.openSettings();
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!isSupported) return 'unsupported';

  const { status } = await Notifications.getPermissionsAsync();
  return status as NotificationPermission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isSupported) return 'unsupported';

  // No Android 13+ o pedido de permissão só aparece depois que existe um canal.
  await ensureAndroidChannel();

  const current = await getNotificationPermission();
  if (current === 'granted') return current;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return status as NotificationPermission;
}

// Serializa as sincronizações para duas chamadas seguidas não se atropelarem.
let syncQueue: Promise<unknown> = Promise.resolve();

export function replaceScheduledReminders(plans: ReminderPlan[]): Promise<number> {
  const job = syncQueue.then(async () => {
    if ((await getNotificationPermission()) !== 'granted') return 0;

    await ensureAndroidChannel();
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const plan of plans) {
      await Notifications.scheduleNotificationAsync({
        identifier: plan.id,
        content: { title: plan.title, body: plan.body, data: { ...plan.data }, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: plan.fireAt,
          channelId: CHANNEL_ID,
        },
      });
    }

    return plans.length;
  });

  syncQueue = job.catch(() => undefined);
  return job;
}

export async function clearScheduledReminders(): Promise<void> {
  await replaceScheduledReminders([]);
  await clearReminderLog();
}

export async function getReminderStatus(): Promise<ReminderStatus> {
  if (!isSupported) return { permission: 'unsupported', scheduledCount: 0 };

  const [permission, scheduled] = await Promise.all([
    getNotificationPermission(),
    Notifications.getAllScheduledNotificationsAsync(),
  ]);

  return { permission, scheduledCount: scheduled.length };
}

function toReminderData(raw: unknown): ReminderData | null {
  const data = raw as Partial<ReminderData> | null | undefined;

  if (data && typeof data.petId === 'number' && (data.tab === 'vacinas' || data.tab === 'clinico' || data.tab === 'consultas')) {
    return { petId: data.petId, tab: data.tab };
  }

  return null;
}

export function subscribeToReminderTaps(handler: (data: ReminderData) => void): () => void {
  if (!isSupported) return () => undefined;

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = toReminderData(response.notification.request.content.data);
    if (data) handler(data);
  });

  return () => subscription.remove();
}

export async function takeReminderTapThatLaunchedApp(): Promise<ReminderData | null> {
  if (!isSupported) return null;

  const response = await Notifications.getLastNotificationResponseAsync();
  if (!response) return null;

  await Notifications.clearLastNotificationResponseAsync();
  return toReminderData(response.notification.request.content.data);
}
