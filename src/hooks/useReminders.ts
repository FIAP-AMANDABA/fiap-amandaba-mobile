import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { archiveDueReminders, planToLogEntry, remindersLeftToday, upcomingReminders } from '../domain/reminderLog';
import { buildReminderPlans } from '../domain/reminders';
import {
  getNotificationPermission,
  getReminderStatus,
  openSystemSettings,
  replaceScheduledReminders,
  requestNotificationPermission,
} from '../services/notificationService';
import {
  loadReminderHistory,
  loadScheduledSnapshot,
  saveReminderHistory,
  saveScheduledSnapshot,
} from '../services/reminderLogService';
import { queryKeys } from './queryKeys';
import { usePetsHealthData } from './usePetsHealthData';

function usePlanBuilder() {
  const { pets, vacinasPorPet, medicamentosPorPet, consultasPorPet, isLoading } = usePetsHealthData();

  const buildPlans = () => buildReminderPlans({ pets, vacinasPorPet, medicamentosPorPet, consultasPorPet, now: new Date() });

  return { buildPlans, isLoading, dependencies: [pets, vacinasPorPet, medicamentosPorPet, consultasPorPet] as const };
}

// Mantém os lembretes locais alinhados com os dados reais (ao mudar os dados e ao voltar ao primeiro plano).
export function useReminderSync(): void {
  const queryClient = useQueryClient();
  const { buildPlans, isLoading, dependencies } = usePlanBuilder();
  const [foregroundCount, setForegroundCount] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setForegroundCount((count) => count + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const plans = buildPlans();

    (async () => {
      // A permissão só é pedida quando há de fato algo para lembrar.
      if (plans.length > 0 && (await getNotificationPermission()) === 'undetermined') {
        await requestNotificationPermission();
      }
      const granted = (await getNotificationPermission()) === 'granted';

      // Antes de reagendar, move para o histórico o que já passou da hora.
      if (granted) {
        const [scheduled, history] = await Promise.all([loadScheduledSnapshot(), loadReminderHistory()]);
        await saveReminderHistory(archiveDueReminders(scheduled, history, new Date()));
      }

      await replaceScheduledReminders(plans);
      if (granted) await saveScheduledSnapshot(plans.map(planToLogEntry));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.reminderStatus }),
        queryClient.invalidateQueries({ queryKey: queryKeys.reminderHistory }),
      ]);
    })().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, foregroundCount, ...dependencies]);
}

export function useUpcomingReminders() {
  const { buildPlans, isLoading, dependencies } = usePlanBuilder();

  const plans = useMemo(
    () => upcomingReminders(buildPlans(), new Date()),
    dependencies
  );

  return { plans, isLoading };
}

export function useTodayReminderCount(): number {
  const { plans } = useUpcomingReminders();
  return useMemo(() => remindersLeftToday(plans, new Date()), [plans]);
}

export function useReminderHistory() {
  return useQuery({
    queryKey: queryKeys.reminderHistory,
    queryFn: loadReminderHistory,
  });
}

export function useReminderStatus() {
  return useQuery({
    queryKey: queryKeys.reminderStatus,
    queryFn: getReminderStatus,
  });
}

export function useEnableReminders() {
  const queryClient = useQueryClient();
  const { buildPlans } = usePlanBuilder();

  const enable = useMutation({
    mutationFn: async () => {
      const permission = await requestNotificationPermission();
      if (permission === 'granted') await replaceScheduledReminders(buildPlans());
      return permission;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reminderStatus }),
  });

  return { enable, openSystemSettings };
}
