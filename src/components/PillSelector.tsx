import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface PillOption {
  label: string;
  value: string;
}

interface PillSelectorProps {
  options: PillOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export function PillSelector({ options, value, onChange }: PillSelectorProps) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.pill, selected && styles.pillSelected]}
            activeOpacity={0.7}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: colors.white,
  },
  pillSelected: {
    borderColor: colors.greenDark,
    backgroundColor: '#E3F5DA',
  },
  label: {
    ...typography.label,
    fontSize: 12,
    color: colors.gray,
  },
  labelSelected: {
    color: colors.greenDark,
  },
});
