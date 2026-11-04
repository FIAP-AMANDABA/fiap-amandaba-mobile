import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createWelcomeStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
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
      color: c.text,
    },
    highlight: {
      ...typography.heading,
      color: c.green,
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
      color: c.text,
    },
    loginLink: {
      ...typography.caption,
      color: c.green,
      textDecorationLine: 'underline',
    },
  });
