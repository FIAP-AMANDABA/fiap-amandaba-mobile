export function formatCpf(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11) return raw;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return raw;
}

// A API guarda espécie/sexo em maiúsculas sem acento; isto só afeta a exibição.
const ACCENT_FIXES: Record<string, string> = {
  FEMEA: 'Fêmea',
  MACHO: 'Macho',
  PASSARO: 'Pássaro',
};

export function formatEnumLabel(value: string): string {
  const upper = value.toUpperCase();
  if (ACCENT_FIXES[upper]) return ACCENT_FIXES[upper];
  return upper.charAt(0) + upper.slice(1).toLowerCase();
}

export function formatWeight(peso: number): string {
  return peso.toLocaleString('pt-BR', { minimumFractionDigits: 1 });
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

// A API devolve anos completos; menos de 1 ano chega como 0.
export function formatAge(years: number): string {
  return years < 1 ? 'menos de 1 ano' : pluralize(years, 'ano', 'anos');
}
