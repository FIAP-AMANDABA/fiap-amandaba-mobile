import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface RecordCardFooter {
  left: string;
  right?: string;
  rightColor?: string;
}

interface RecordCardProps {
  title: string;
  badge?: string;
  lines?: string[];
  footer?: RecordCardFooter;
}

export function RecordCard({ title, badge, lines, footer }: RecordCardProps) {
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
          {footer.right && (
            <Text style={[styles.footerRight, { color: footer.rightColor ?? colors.greenDark }]}>
              {footer.right}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
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
    color: colors.black,
    flexShrink: 1,
  },
  line: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  footerLeft: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  footerRight: {
    ...typography.bodySemiBold,
    fontSize: 12,
  },
});
