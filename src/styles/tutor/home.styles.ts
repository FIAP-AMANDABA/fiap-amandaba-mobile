import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createHomeStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    header: {
      flexShrink: 1,
      gap: 2,
    },
    tutorLabel: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.textMuted,
      textTransform: 'uppercase',
    },
    title: {
      ...typography.heading,
      fontSize: 28,
      color: c.text,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    section: {
      gap: spacing.sm,
    },
    petsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingRight: spacing.lg,
    },
    healthCard: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
      gap: spacing.xs,
    },
    healthName: {
      ...typography.label,
      color: c.text,
    },
    doseList: {
      gap: spacing.sm,
    },
  });
