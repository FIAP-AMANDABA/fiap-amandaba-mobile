import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../interfaces/navigation';
import type { ReminderData } from '../interfaces/reminder';

// Permite navegar fora de componentes (encerrar sessão, abrir o pet pela notificação).
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToWelcome(): void {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Welcome' }] }));
}

export function resetToLogin(params?: RootStackParamList['Login']): void {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login', params }] }));
}

// false = a navegação ainda não está pronta; o chamador tenta de novo.
export function openPetFromReminder(data: ReminderData): boolean {
  if (!navigationRef.isReady()) return false;

  navigationRef.navigate('TutorRoot', {
    screen: 'Pets',
    params: { screen: 'PetDetail', params: { petId: data.petId, initialTab: data.tab } },
  });
  return true;
}
