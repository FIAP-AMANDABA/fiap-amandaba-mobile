import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { UpcomingDose } from '../interfaces/home';
import { formatDateBr } from '../services/dateUtils';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface DoseListItemProps {
  dose: UpcomingDose;
}

export function DoseListItem({ dose }: DoseListItemProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{dose.vacinaNome.toUpperCase()}</Text>
        <Text style={styles.pet}>{dose.petNome}</Text>
      </View>
      <Text style={styles.date}>{formatDateBr(dose.proximaDose)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  name: {
    ...typography.label,
    color: colors.black,
  },
  pet: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
  },
  date: {
    ...typography.bodySemiBold,
    color: colors.greenDark,
  },
});
