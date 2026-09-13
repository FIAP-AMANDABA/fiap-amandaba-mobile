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
  photoImage: {
    width: '100%',
    height: '100%',
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
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodySemiBold,
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
  },
  rolesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
  },
  roleCardSelected: {
    borderColor: colors.greenDark,
    backgroundColor: '#E3F5DA',
  },
  roleTitle: {
    ...typography.label,
    fontSize: 13,
    color: colors.gray,
  },
  roleTitleSelected: {
    color: colors.greenDark,
  },
  roleSubtitle: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
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
