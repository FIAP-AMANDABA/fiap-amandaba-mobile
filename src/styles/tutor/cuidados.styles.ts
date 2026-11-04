import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createCuidadosStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    subtitle: {
      ...typography.body,
      color: c.textMuted,
      marginTop: -spacing.sm,
    },
    list: {
      gap: spacing.sm,
    },
    petRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.sm,
    },
    petInfo: {
      flex: 1,
    },
    petNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    photo: {
      width: 52,
      height: 52,
      borderRadius: 8,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    petName: {
      ...typography.label,
      color: c.text,
    },
    petDetails: {
      ...typography.bodySmall,
      color: c.textMuted,
      marginTop: 2,
    },
    errorText: {
      ...typography.body,
      color: c.red,
    },
    resultCard: {
      gap: spacing.xs,
      backgroundColor: c.tealSurface,
      borderColor: c.teal,
      borderWidth: 1,
      borderRadius: 12,
      padding: spacing.md,
    },
    generatedAt: {
      ...typography.bodySmall,
      color: c.textMuted,
      marginBottom: spacing.sm,
    },
    disclaimer: {
      ...typography.bodySmall,
      color: c.textMuted,
      lineHeight: 16,
    },
    placeholderText: {
      ...typography.body,
      color: c.textMuted,
      lineHeight: 20,
    },
  });
