import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createPetFormStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    fieldGroup: {
      gap: spacing.sm,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    fieldLabel: {
      ...typography.bodySemiBold,
      fontSize: 11,
      color: c.textMuted,
      textTransform: 'uppercase',
    },
    lockedInput: {
      opacity: 0.6,
    },
    hintText: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
    },
    submitButton: {
      marginTop: spacing.sm,
    },
  });
