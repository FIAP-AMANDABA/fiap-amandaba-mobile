import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createVeterinariosStyles = (c: Palette) =>
  StyleSheet.create({
    hint: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
    },
    shareBlock: {
      gap: spacing.xs,
    },
    revokeButton: {
      alignSelf: 'flex-end',
      paddingVertical: spacing.xs,
    },
    revokeLabel: {
      ...typography.bodySmall,
      color: c.red,
      textDecorationLine: 'underline',
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
    },
    resultInfo: {
      flexShrink: 1,
      gap: 2,
    },
    resultName: {
      ...typography.label,
      color: c.text,
    },
    resultCrmv: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    shareButton: {
      borderWidth: 1.5,
      borderColor: c.greenDark,
      borderRadius: 10,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    shareLabel: {
      ...typography.label,
      fontSize: 12,
      color: c.greenDark,
    },
  });
