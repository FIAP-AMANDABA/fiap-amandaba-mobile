import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface CurrentWeightCardProps {
  peso: number;
  dataMedicao: string;
}

export function CurrentWeightCard({ peso, dataMedicao }: CurrentWeightCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>PESO ATUAL</Text>
        <Text style={styles.value}>{peso.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg</Text>
      </View>
      <Text style={styles.date}>medido em {dataMedicao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    ...typography.label,
    fontSize: 11,
    color: colors.white,
    opacity: 0.8,
  },
  value: {
    ...typography.heading,
    fontSize: 30,
    color: colors.white,
  },
  date: {
    ...typography.bodySemiBold,
    fontSize: 11,
    color: colors.green,
  },
});
