import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';

export const petsListStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
});
