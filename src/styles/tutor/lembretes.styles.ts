import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createLembretesStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    section: {
      gap: spacing.sm,
    },
    sectionTitle: {
      ...typography.bodySemiBold,
      fontSize: 12,
      color: c.textMuted,
      textTransform: 'uppercase',
    },
  });
