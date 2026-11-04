import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface RecordCardFooter {
  left: string;
  right?: string;
}

interface RecordCardProps {
  title: string;
  badge?: string;
  lines?: string[];
  footer?: RecordCardFooter;
}

export function RecordCard({ title, badge, lines, footer }: RecordCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        {badge && <StatusBadge status={badge} />}
      </View>

      {lines?.map((line, index) => (
        <Text key={index} style={styles.line}>
          {line}
        </Text>
      ))}

      {footer && (
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>{footer.left}</Text>
          {footer.right && <Text style={styles.footerRight}>{footer.right}</Text>}
        </View>
      )}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
      gap: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...typography.label,
      color: c.text,
      flexShrink: 1,
    },
    line: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    footerLeft: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    footerRight: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.greenDark,
    },
  });
