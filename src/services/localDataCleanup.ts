import { clearCarePlans } from './carePlanStorage';
import { clearScheduledReminders } from './notificationService';

// Tudo que fica guardado no aparelho em nome do usuário; chamado ao sair e quando a sessão expira.
export async function clearLocalUserData(): Promise<void> {
  await Promise.allSettled([clearScheduledReminders(), clearCarePlans()]);
}
