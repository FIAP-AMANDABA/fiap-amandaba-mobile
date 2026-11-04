import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PacienteResumo } from '../interfaces/veterinario';
import type { RelatorioPet } from '../interfaces/relatorio';
import { PetHealthSummary } from './PetHealthSummary';
import { StatusBadge } from './StatusBadge';
import { formatEnumLabel } from '../utils/formatUtils';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PacienteListItemProps {
  paciente: PacienteResumo;
  resumo?: RelatorioPet;
  onPress: () => void;
}

export function PacienteListItem({ paciente, resumo, onPress }: PacienteListItemProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.icon}>
        <Ionicons name="paw-outline" size={22} color={palette.textMuted} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{paciente.nome.toUpperCase()}</Text>
          <StatusBadge status={paciente.status} />
        </View>
        <Text style={styles.details}>{formatEnumLabel(paciente.especie)}</Text>
        {resumo && <PetHealthSummary item={resumo} />}
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
    </TouchableOpacity>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.sm,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    name: {
      ...typography.label,
      color: c.text,
    },
    details: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
  });
