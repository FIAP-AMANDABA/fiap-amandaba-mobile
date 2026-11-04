import { View, Text, StyleSheet } from 'react-native';
import type { UpcomingDose } from '../interfaces/home';
import { formatDateBr } from '../utils/dateUtils';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface DoseListItemProps {
  dose: UpcomingDose;
}

export function DoseListItem({ dose }: DoseListItemProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{dose.vacinaNome.toUpperCase()}</Text>
        <Text style={styles.pet}>{dose.petNome}</Text>
      </View>
      <Text style={styles.date}>{formatDateBr(dose.proximaDose)}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    name: {
      ...typography.label,
      color: c.text,
    },
    pet: {
      ...typography.bodySmall,
      color: c.textMuted,
      marginTop: 2,
    },
    date: {
      ...typography.bodySemiBold,
      color: c.greenDark,
    },
  });
