import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string | null;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'CONFIRMAR',
  cancelLabel = 'CANCELAR',
  errorMessage,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={onCancel}>
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, !destructive && styles.confirmButtonPrimary]}
              activeOpacity={0.8}
              onPress={onConfirm}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      ...typography.heading,
      fontSize: 18,
      color: c.text,
    },
    message: {
      ...typography.body,
      color: c.textMuted,
    },
    errorText: {
      ...typography.bodySmall,
      color: c.red,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    cancelButton: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: c.border,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    cancelLabel: {
      ...typography.label,
      color: c.textMuted,
    },
    confirmButton: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: c.red,
      backgroundColor: c.red,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    confirmButtonPrimary: {
      borderColor: c.greenDark,
      backgroundColor: c.greenDark,
    },
    confirmLabel: {
      ...typography.label,
      color: c.onColor,
    },
  });
