import type { UserRole } from '../interfaces/auth';

export function homeRouteFor(role: UserRole | null): 'TutorRoot' | 'VetRoot' | 'Welcome' {
  if (role === 'TUTOR') return 'TutorRoot';
  if (role === 'VETERINARIO') return 'VetRoot';
  return 'Welcome';
}
