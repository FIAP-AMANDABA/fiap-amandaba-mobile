import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export const petDetailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendarConsulta: {
    ...typography.bodySemiBold,
    fontSize: 12,
    color: colors.greenDark,
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
    backgroundColor: colors.grayLight,
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
  },
  petName: {
    ...typography.heading,
    fontSize: 24,
    color: colors.black,
  },
  petSubtitle: {
    ...typography.body,
    color: colors.gray,
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
    color: colors.gray,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addLink: {
    ...typography.bodySemiBold,
    fontSize: 12,
    color: colors.greenDark,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  historyValue: {
    ...typography.bodySemiBold,
    color: colors.black,
  },
  historyDate: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.red,
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: colors.greenDark,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  editButtonLabel: {
    ...typography.label,
    color: colors.greenDark,
  },
  deleteButton: {
    borderWidth: 1.5,
    borderColor: colors.red,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteButtonLabel: {
    ...typography.label,
    color: colors.red,
  },
});
