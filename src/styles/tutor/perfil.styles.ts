import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const perfilStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    ...typography.label,
    fontSize: 16,
    color: colors.black,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  logoutLabel: {
    ...typography.label,
    color: colors.red,
  },
  deleteAccountLabel: {
    ...typography.label,
    color: colors.red,
    textAlign: 'center',
    marginTop: -spacing.md,
  },
});
