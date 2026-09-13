import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { CicloItem } from '../interfaces/home';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface CicloSemanaCardProps {
  items: CicloItem[];
}

export function CicloSemanaCard({ items }: CicloSemanaCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>CICLO DA SEMANA</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Nenhum cuidado recorrente em andamento.</Text>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemLabel}>
                  {item.petNome} · {item.medicamentoNome}
                </Text>
                {item.overdue && <Text style={styles.overdue}>ATRASADO</Text>}
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${Math.round(item.percent * 100)}%`,
                      backgroundColor: item.overdue ? colors.red : colors.green,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    ...typography.bodyMedium,
    color: colors.white,
  },
  overdue: {
    ...typography.bodySemiBold,
    fontSize: 11,
    color: '#F5A28C',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.purpleDark,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
