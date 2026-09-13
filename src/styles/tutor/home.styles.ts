import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    gap: 2,
  },
  tutorLabel: {
    ...typography.bodySemiBold,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    color: colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  petsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  doseList: {
    gap: spacing.sm,
  },
});
