import { View, Text, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

interface InfoRowProps {
  label: string;
  value: string;
  tinted?: boolean;
}

export function InfoRow({ label, value, tinted }: InfoRowProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Text style={[styles.label, tinted && styles.labelTinted]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    label: {
      ...typography.body,
      color: c.textMuted,
    },
    labelTinted: {
      color: c.rose,
    },
    value: {
      ...typography.bodySemiBold,
      color: c.text,
    },
  });
