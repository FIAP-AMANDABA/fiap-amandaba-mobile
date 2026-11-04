import { useCallback, useEffect, useRef } from 'react';
import type { ReminderData } from '../interfaces/reminder';
import { subscribeToReminderTaps, takeReminderTapThatLaunchedApp } from '../services/notificationService';
import { useAuth } from '../providers/AuthProvider';
import { openPetFromReminder } from './navigationRef';

// Abre o pet ao tocar num lembrete (app aberto, em segundo plano ou fechado); sem sessão, o toque fica pendente.
export function useNotificationNavigation(): () => void {
  const { userId } = useAuth();
  const pending = useRef<ReminderData | null>(null);

  const tryOpenPending = useCallback(() => {
    if (!pending.current || userId === null) return;
    if (openPetFromReminder(pending.current)) pending.current = null;
  }, [userId]);

  useEffect(() => {
    takeReminderTapThatLaunchedApp()
      .then((data) => {
        if (data) {
          pending.current = data;
          tryOpenPending();
        }
      })
      .catch(() => undefined);
    // Só no arranque do app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () =>
      subscribeToReminderTaps((data) => {
        pending.current = data;
        tryOpenPending();
      }),
    [tryOpenPending]
  );

  useEffect(() => {
    tryOpenPending();
  }, [tryOpenPending]);

  // O NavigationContainer chama quando ficar pronto (o toque pode chegar antes).
  return tryOpenPending;
}
