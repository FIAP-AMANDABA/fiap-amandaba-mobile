import { ConfirmModal } from './ConfirmModal';

interface DeleteRecordModalProps {
  visible: boolean;
  recordLabel: string;
  isPending: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteRecordModal({
  visible,
  recordLabel,
  isPending,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteRecordModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      title="Excluir registro"
      message={`Excluir "${recordLabel}"? Essa ação não pode ser desfeita.`}
      confirmLabel={isPending ? 'EXCLUINDO...' : 'EXCLUIR'}
      errorMessage={errorMessage}
      onCancel={onCancel}
      onConfirm={isPending ? () => undefined : onConfirm}
    />
  );
}
