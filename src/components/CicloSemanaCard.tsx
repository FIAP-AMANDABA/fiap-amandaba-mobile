import { View, Text, StyleSheet } from 'react-native';
import type { CicloItem } from '../interfaces/home';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface CicloSemanaCardProps {
  items: CicloItem[];
}

export function CicloSemanaCard({ items }: CicloSemanaCardProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

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
                      backgroundColor: item.overdue ? palette.red : palette.green,
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

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.purple,
      borderRadius: 16,
      padding: spacing.md,
    },
    title: {
      ...typography.label,
      color: c.onColor,
      marginBottom: spacing.sm,
    },
    empty: {
      ...typography.body,
      color: c.onColor,
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
      color: c.onColor,
    },
    overdue: {
      ...typography.bodySemiBold,
      fontSize: 11,
      color: c.overdueText,
    },
    track: {
      height: 6,
      borderRadius: 3,
      backgroundColor: c.purpleDark,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 3,
    },
  });
