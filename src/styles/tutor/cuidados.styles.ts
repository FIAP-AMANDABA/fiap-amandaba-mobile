import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const cuidadosStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    marginTop: -spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
  },
  photo: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  petName: {
    ...typography.label,
    color: colors.black,
  },
  petDetails: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
  },
  planoTitle: {
    ...typography.heading,
    fontSize: 26,
    color: colors.black,
  },
  planoSubtitle: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 18,
  },
  resultCard: {
    backgroundColor: colors.tealLight,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
  },
  resultText: {
    ...typography.body,
    color: colors.black,
    lineHeight: 20,
  },
  placeholderText: {
    ...typography.body,
    color: colors.gray,
    lineHeight: 20,
  },
});
