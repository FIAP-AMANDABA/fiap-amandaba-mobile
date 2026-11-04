import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface RecordAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface RecordActionsProps {
  actions: RecordAction[];
}

export function RecordActions({ actions }: RecordActionsProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <TouchableOpacity key={action.label} activeOpacity={0.7} onPress={action.onPress}>
          <Text style={[styles.label, action.destructive ? styles.destructive : styles.normal]}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      columnGap: spacing.md,
      rowGap: spacing.xs,
    },
    label: {
      ...typography.bodySmall,
      textDecorationLine: 'underline',
    },
    normal: {
      color: c.greenDark,
    },
    destructive: {
      color: c.red,
    },
  });
