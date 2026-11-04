import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createRegisterStyles = (c: Palette) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 1,
      backgroundColor: c.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    hero: {
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    heroImage: {
      width: 220,
      height: 220,
    },
    title: {
      ...typography.title,
      color: c.text,
      marginTop: spacing.lg,
      marginBottom: spacing.lg,
    },
    fieldGroup: {
      gap: spacing.sm,
    },
    fieldLabel: {
      ...typography.bodySemiBold,
      fontSize: 11,
      color: c.textMuted,
    },
    form: {
      gap: spacing.md,
    },
    submitButton: {
      marginTop: spacing.lg,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
      marginTop: spacing.sm,
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    loginText: {
      ...typography.caption,
      color: c.text,
    },
    loginLink: {
      ...typography.caption,
      color: c.green,
      textDecorationLine: 'underline',
    },
  });
