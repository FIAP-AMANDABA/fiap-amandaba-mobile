import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InfoHint, type InfoContent } from './InfoHint';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SectionAddHeaderProps {
  title: string;
  onAdd: () => void;
  addLabel?: string;
  info?: InfoContent;
}

export function SectionAddHeader({ title, onAdd, addLabel = '+ ADICIONAR', info }: SectionAddHeaderProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {info && <InfoHint title={info.title} text={info.text} />}
      </View>
      <TouchableOpacity onPress={onAdd}>
        <Text style={styles.add}>{addLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    title: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.textMuted,
      textTransform: 'uppercase',
    },
    add: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.greenDark,
    },
  });
