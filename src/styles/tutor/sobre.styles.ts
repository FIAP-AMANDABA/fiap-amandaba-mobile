import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';

export const createSobreStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
    },
  });
