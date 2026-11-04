import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createPetDetailStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    petHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 999,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    petInfo: {
      gap: 4,
      flexShrink: 1,
    },
    petName: {
      ...typography.heading,
      fontSize: 24,
      color: c.text,
    },
    petSubtitle: {
      ...typography.body,
      color: c.textMuted,
    },
    tabContent: {
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
    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.md,
    },
    recordBlock: {
      gap: spacing.xs,
    },
    historyList: {
      gap: spacing.sm,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    historyValue: {
      ...typography.bodySemiBold,
      color: c.text,
    },
    historyDate: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
    },
    editButton: {
      borderWidth: 1.5,
      borderColor: c.greenDark,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    editButtonLabel: {
      ...typography.label,
      color: c.greenDark,
    },
    deleteButton: {
      borderWidth: 1.5,
      borderColor: c.red,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    deleteButtonLabel: {
      ...typography.label,
      color: c.red,
    },
  });
