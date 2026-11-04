import type { Consulta } from '../interfaces/consulta';

export const isScheduled = (consulta: Consulta): boolean => consulta.status === 'AGENDADA';

const sortKey = (consulta: Consulta): string => `${consulta.dataConsulta.slice(0, 10)} ${consulta.horario ?? '00:00'}`;

export function sortConsultas(consultas: Consulta[]): Consulta[] {
  return [...consultas].sort((a, b) => {
    if (isScheduled(a) !== isScheduled(b)) return isScheduled(a) ? -1 : 1;
    return isScheduled(a) ? sortKey(a).localeCompare(sortKey(b)) : sortKey(b).localeCompare(sortKey(a));
  });
}
