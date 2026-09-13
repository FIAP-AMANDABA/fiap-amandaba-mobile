export function parseBrDate(value: string): string | undefined {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function formatDateBr(iso: string | null | undefined): string {
  if (!iso) return '—';

  // Datas "yyyy-MM-dd" (sem horário) são formatadas sem passar por Date,
  // que interpretaria como UTC e poderia exibir o dia anterior no fuso local.
  const dateOnly = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${day}/${month}/${year}`;
  }

  return new Date(iso).toLocaleDateString('pt-BR');
}
