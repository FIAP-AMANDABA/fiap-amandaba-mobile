import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InfoHint } from './InfoHint';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface AiCarePlanCardProps {
  onPress?: () => void;
}

export function AiCarePlanCard({ onPress }: AiCarePlanCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={onPress ? 0.8 : 1} onPress={onPress} disabled={!onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>PLANO DE CUIDADOS POR IA</Text>
        <InfoHint
          title="Plano de cuidados por IA"
          text="Cruza medicamentos, alergias e doenças do pet e devolve um plano diário."
        />
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.tealSurface,
      borderColor: c.teal,
      borderWidth: 1,
      borderRadius: 12,
      padding: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      ...typography.label,
      color: c.text,
    },
  });
