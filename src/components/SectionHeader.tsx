import { View, Text, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && (
        <Text style={styles.action} onPress={onPressAction}>
          {actionLabel}
        </Text>
      )}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...typography.label,
      color: c.text,
    },
    action: {
      ...typography.bodySemiBold,
      color: c.green,
    },
  });
