import { View, Text, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
    },
    text: {
      ...typography.body,
      color: c.textMuted,
    },
  });
