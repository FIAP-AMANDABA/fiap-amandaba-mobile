import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const POSITIVE = ['ATIVO', 'EM_USO', 'DISPONIVEL', 'REALIZADA', 'RESULTADO_DISPONIVEL', 'CURADA'];
const WARNING = ['MODERADA', 'LEVE', 'EM_TRATAMENTO', 'EM TRATAMENTO', 'PENDENTE'];
const NEGATIVE = ['INATIVO', 'SUSPENSO', 'ATRASADO', 'GRAVE', 'CANCELADA'];

function getBadgeColors(status: string): { bg: string; fg: string } {
  const normalized = status.toUpperCase();

  if (POSITIVE.some((s) => normalized.includes(s))) {
    return { bg: '#E3F5DA', fg: colors.greenDark };
  }
  if (WARNING.some((s) => normalized.includes(s))) {
    return { bg: colors.tealLight, fg: '#3B7D79' };
  }
  if (NEGATIVE.some((s) => normalized.includes(s))) {
    return { bg: '#FBE6E3', fg: colors.red };
  }
  return { bg: colors.grayLight, fg: colors.gray };
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, fg } = getBadgeColors(status);

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.bodySemiBold,
    fontSize: 10,
  },
});
