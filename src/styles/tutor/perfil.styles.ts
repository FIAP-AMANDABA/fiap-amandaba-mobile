import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createPerfilStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    title: {
      ...typography.heading,
      fontSize: 28,
      color: c.text,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: spacing.md,
      gap: spacing.md,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    photo: {
      width: 60,
      height: 60,
      borderRadius: 999,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    name: {
      ...typography.label,
      fontSize: 16,
      color: c.text,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
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
    outlineButton: {
      borderWidth: 1.5,
      borderColor: c.greenDark,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    outlineButtonLabel: {
      ...typography.label,
      color: c.greenDark,
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    menuLabel: {
      ...typography.label,
      color: c.text,
    },
    logoutButton: {
      borderWidth: 1.5,
      borderColor: c.red,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    logoutLabel: {
      ...typography.label,
      color: c.red,
    },
    deleteLink: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    deleteLinkLabel: {
      ...typography.bodySmall,
      color: c.red,
      textDecorationLine: 'underline',
    },
  });
