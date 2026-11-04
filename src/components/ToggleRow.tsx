import { View, Text, Switch, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>
        <Text style={styles.valueLabel}>{value ? 'Sim' : 'Não'}</Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: palette.border, true: palette.green }}
          thumbColor={palette.onColor}
        />
      </View>
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
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: c.green,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
    },
    label: {
      ...typography.label,
      color: c.text,
    },
    control: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    valueLabel: {
      ...typography.body,
      color: c.textMuted,
    },
  });
