import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const loginStyles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: colors.background,
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
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.red,
    marginTop: spacing.sm,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    ...typography.caption,
    color: colors.black,
  },
  registerLink: {
    ...typography.caption,
    color: colors.green,
    textDecorationLine: 'underline',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
