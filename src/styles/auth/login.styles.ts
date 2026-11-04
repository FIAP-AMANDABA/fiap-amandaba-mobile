import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createLoginStyles = (c: Palette) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      flexGrow: 1,
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
    form: {
      gap: spacing.md,
    },
    submitButton: {
      marginTop: spacing.lg,
    },
    noticeText: {
      ...typography.bodySmall,
      color: c.textMuted,
      marginBottom: spacing.md,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
      marginTop: spacing.sm,
    },
    registerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    registerText: {
      ...typography.caption,
      color: c.text,
    },
    registerLink: {
      ...typography.caption,
      color: c.green,
      textDecorationLine: 'underline',
    },
  });
