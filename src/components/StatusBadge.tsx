import { View, Text, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

const POSITIVE = ['ATIVO', 'EM_USO', 'DISPONIVEL', 'REALIZADA', 'RESULTADO_DISPONIVEL', 'CURADA'];
const WARNING = ['MODERADA', 'LEVE', 'EM_TRATAMENTO', 'EM TRATAMENTO', 'PENDENTE'];
const NEGATIVE = ['INATIVO', 'SUSPENSO', 'ATRASADO', 'GRAVE', 'CANCELADA'];

function getBadgeColors(status: string, c: Palette): { bg: string; fg: string } {
  const normalized = status.toUpperCase();

  if (POSITIVE.some((s) => normalized.includes(s))) {
    return { bg: c.selectedBg, fg: c.greenDark };
  }
  if (WARNING.some((s) => normalized.includes(s))) {
    return { bg: c.tealSurface, fg: c.tealText };
  }
  if (NEGATIVE.some((s) => normalized.includes(s))) {
    return { bg: c.redSurface, fg: c.red };
  }
  return { bg: c.border, fg: c.textMuted };
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { palette } = useTheme();
  const { bg, fg } = getBadgeColors(status, palette);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{status.replace(/_/g, ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.bodySemiBold,
    fontSize: 10,
  },
});
