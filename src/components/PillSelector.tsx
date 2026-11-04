import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PillOption {
  label: string;
  value: string;
}

interface PillSelectorProps {
  options: PillOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export function PillSelector({ options, value, onChange }: PillSelectorProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.pill, selected && styles.pillSelected]}
            activeOpacity={0.7}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    pill: {
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    pillSelected: {
      borderColor: c.greenDark,
      backgroundColor: c.selectedBg,
    },
    label: {
      ...typography.label,
      fontSize: 12,
      color: c.textMuted,
    },
    labelSelected: {
      color: c.greenDark,
    },
  });
