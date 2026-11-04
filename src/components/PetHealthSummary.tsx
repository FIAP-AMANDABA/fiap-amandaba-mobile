import { View, Text, StyleSheet } from 'react-native';
import type { RelatorioPet } from '../interfaces/relatorio';
import { formatAge, pluralize } from '../utils/formatUtils';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PetHealthSummaryProps {
  item: RelatorioPet;
}

export function PetHealthSummary({ item }: PetHealthSummaryProps) {
  const styles = useThemedStyles(createStyles);

  const indicators = [
    item.idadeAnos != null ? { text: formatAge(item.idadeAnos), alert: false } : null,
    { text: pluralize(item.doencasAtivas, 'doença ativa', 'doenças ativas'), alert: item.doencasAtivas > 0 },
    { text: pluralize(item.medicamentosEmUso, 'medicamento em uso', 'medicamentos em uso'), alert: false },
    { text: pluralize(item.vacinasAtrasadas, 'vacina atrasada', 'vacinas atrasadas'), alert: item.vacinasAtrasadas > 0 },
    { text: pluralize(item.consultasRegistradas, 'consulta', 'consultas'), alert: false },
  ].filter((indicator): indicator is { text: string; alert: boolean } => indicator !== null);

  return (
    <View style={styles.row}>
      {indicators.map((indicator) => (
        <Text key={indicator.text} style={[styles.item, indicator.alert && styles.alert]}>
          {indicator.text}
        </Text>
      ))}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: spacing.sm,
      rowGap: 2,
    },
    item: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    alert: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.red,
    },
  });
