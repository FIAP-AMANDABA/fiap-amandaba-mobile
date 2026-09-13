import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.control}>
        <Text style={styles.valueLabel}>{value ? 'Sim' : 'Não'}</Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.grayLight, true: colors.green }}
          thumbColor={colors.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  label: {
    ...typography.label,
    color: colors.black,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  valueLabel: {
    ...typography.body,
    color: colors.gray,
  },
});
