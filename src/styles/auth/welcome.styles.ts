import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: {
    height: 300,
    marginTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    marginTop: spacing.md,
  },
  heading: {
    ...typography.heading,
    color: colors.black,
  },
  highlight: {
    ...typography.heading,
    color: colors.green,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loginText: {
    ...typography.caption,
    color: colors.black,
  },
  loginLink: {
    ...typography.caption,
    color: colors.green,
    textDecorationLine: 'underline',
  },
});
