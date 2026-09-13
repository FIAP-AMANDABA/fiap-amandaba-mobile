import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string | null;
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
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
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
            <TouchableOpacity style={styles.confirmButton} activeOpacity={0.8} onPress={onConfirm}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    fontSize: 18,
    color: colors.black,
  },
  message: {
    ...typography.body,
    color: colors.gray,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.red,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  cancelLabel: {
    ...typography.label,
    color: colors.gray,
  },
  confirmButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.red,
    backgroundColor: colors.red,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  confirmLabel: {
    ...typography.label,
    color: colors.white,
  },
});
