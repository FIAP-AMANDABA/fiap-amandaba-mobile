import { View, Text, StyleSheet } from 'react-native';
import { formatWeight } from '../utils/formatUtils';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface CurrentWeightCardProps {
  peso: number;
  dataMedicao: string;
}

export function CurrentWeightCard({ peso, dataMedicao }: CurrentWeightCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>PESO ATUAL</Text>
        <Text style={styles.value}>{formatWeight(peso)} kg</Text>
      </View>
      <Text style={styles.date}>medido em {dataMedicao}</Text>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.purple,
      borderRadius: 16,
      padding: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    label: {
      ...typography.label,
      fontSize: 11,
      color: c.onColor,
      opacity: 0.8,
    },
    value: {
      ...typography.heading,
      fontSize: 30,
      color: c.onColor,
    },
    date: {
      ...typography.bodySemiBold,
      fontSize: 11,
      color: c.green,
    },
  });
