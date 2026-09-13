import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface AiCarePlanCardProps {
  onPress?: () => void;
}

export function AiCarePlanCard({ onPress }: AiCarePlanCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={onPress ? 0.8 : 1} onPress={onPress} disabled={!onPress}>
      <Text style={styles.title}>PLANO DE CUIDADOS POR IA</Text>
      <Text style={styles.description}>
        Cruza medicamentos, alergias e doenças do pet e devolve um plano diário.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tealLight,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 18,
  },
});
