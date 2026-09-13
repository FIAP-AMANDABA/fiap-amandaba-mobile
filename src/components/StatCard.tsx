import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface StatCardProps {
  value: number | string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'flex-start',
  },
  value: {
    ...typography.heading,
    fontSize: 24,
    lineHeight: 26,
    color: colors.black,
  },
  label: {
    ...typography.bodySmall,
    color: colors.gray,
  },
});
