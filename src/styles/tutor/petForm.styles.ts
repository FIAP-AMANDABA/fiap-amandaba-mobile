import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const petFormStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    ...typography.bodySemiBold,
    fontSize: 11,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.red,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
