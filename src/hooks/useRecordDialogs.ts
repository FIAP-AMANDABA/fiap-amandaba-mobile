import { useState } from 'react';
import { getErrorMessage } from '../services/http';

interface DeletionMutation {
  mutateAsync: (recordId: number) => Promise<unknown>;
  reset: () => void;
  isPending: boolean;
  error: unknown;
}

interface StatusMutation<TStatus extends string> {
  mutateAsync: (vars: { recordId: number; status: TStatus }) => Promise<unknown>;
  reset: () => void;
  isPending: boolean;
  error: unknown;
}

export function useFormTarget<T>() {
  const [target, setTarget] = useState<{ record?: T } | null>(null);

  return {
    target,
    openNew: () => setTarget({}),
    openEdit: (record: T) => setTarget({ record }),
    close: () => setTarget(null),
  };
}

export function useRecordDeletion<T>(
  mutation: DeletionMutation,
  idOf: (record: T) => number,
  labelOf: (record: T) => string
) {
  const [target, setTarget] = useState<T | null>(null);

  const ask = (record: T) => {
    mutation.reset();
    setTarget(record);
  };

  const confirm = async () => {
    if (!target) return;
    try {
      await mutation.mutateAsync(idOf(target));
      setTarget(null);
    } catch {
      // o erro aparece no modal
    }
  };

  return {
    ask,
    modalProps: {
      visible: target !== null,
      recordLabel: target ? labelOf(target) : '',
      isPending: mutation.isPending,
      errorMessage: mutation.error ? getErrorMessage(mutation.error, 'Não foi possível excluir.') : null,
      onCancel: () => setTarget(null),
      onConfirm: confirm,
    },
  };
}

export function useStatusDialog<T, TStatus extends string>(
  mutation: StatusMutation<TStatus>,
  idOf: (record: T) => number
) {
  const [target, setTarget] = useState<T | null>(null);

  const open = (record: T) => {
    mutation.reset();
    setTarget(record);
  };

  const select = async (status: string) => {
    if (!target) return;
    try {
      await mutation.mutateAsync({ recordId: idOf(target), status: status as TStatus });
      setTarget(null);
    } catch {
      // o erro aparece no modal
    }
  };

  return {
    open,
    target,
    modalProps: {
      visible: target !== null,
      isPending: mutation.isPending,
      errorMessage: mutation.error ? getErrorMessage(mutation.error, 'Não foi possível alterar o status.') : null,
      onClose: () => setTarget(null),
      onSelect: select,
    },
  };
}
