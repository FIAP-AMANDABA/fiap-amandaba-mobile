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

// A API guarda espécie/sexo em maiúsculas sem acento (ex.: "CACHORRO", "FEMEA").
// Só cobre exibição — o valor enviado de volta pra API continua o original.
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
