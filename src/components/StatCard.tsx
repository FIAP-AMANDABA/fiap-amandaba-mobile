import { View, Text, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface StatCardProps {
  value: number | string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      alignItems: 'flex-start',
    },
    value: {
      ...typography.heading,
      fontSize: 24,
      lineHeight: 26,
      color: c.text,
    },
    label: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
  });
