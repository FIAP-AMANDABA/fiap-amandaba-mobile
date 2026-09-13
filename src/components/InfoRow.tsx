import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

interface InfoRowProps {
  label: string;
  value: string;
  labelColor?: string;
}

export function InfoRow({ label, value, labelColor }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, labelColor && { color: labelColor }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  label: {
    ...typography.body,
    color: colors.gray,
  },
  value: {
    ...typography.bodySemiBold,
    color: colors.black,
  },
});
