import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ReminderStatus } from '../interfaces/reminder';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ReminderStatusCardProps {
  status: ReminderStatus | undefined;
  enabling: boolean;
  onEnable: () => void;
  onOpenSettings: () => void;
}

export function ReminderStatusCard({ status, enabling, onEnable, onOpenSettings }: ReminderStatusCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>NOTIFICAÇÕES DE SAÚDE</Text>

      {status?.permission === 'unsupported' && (
        <Text style={styles.text}>Notificações indisponíveis na versão web.</Text>
      )}

      {status?.permission === 'granted' && (
        <Text style={styles.active}>
          {status.scheduledCount} lembrete{status.scheduledCount === 1 ? '' : 's'} agendado
          {status.scheduledCount === 1 ? '' : 's'}
        </Text>
      )}

      {status?.permission === 'undetermined' && (
        <>
          <Text style={styles.text}>Notificações desativadas.</Text>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onEnable}>
            <Text style={styles.buttonLabel}>{enabling ? 'ATIVANDO...' : 'ATIVAR NOTIFICAÇÕES'}</Text>
          </TouchableOpacity>
        </>
      )}

      {status?.permission === 'denied' && (
        <>
          <Text style={styles.text}>Notificações bloqueadas para o app.</Text>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onOpenSettings}>
            <Text style={styles.buttonLabel}>ABRIR AJUSTES</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: spacing.md,
      gap: spacing.sm,
    },
    title: {
      ...typography.label,
      color: c.text,
    },
    text: {
      ...typography.body,
      color: c.textMuted,
      lineHeight: 18,
    },
    active: {
      ...typography.bodySemiBold,
      color: c.greenDark,
    },
    button: {
      borderWidth: 1.5,
      borderColor: c.greenDark,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    buttonLabel: {
      ...typography.label,
      color: c.greenDark,
    },
  });
