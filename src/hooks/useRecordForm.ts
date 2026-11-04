import { useCallback, useState } from 'react';
import type { BuildResult } from '../domain/buildResult';
import { getErrorMessage } from '../services/http';

interface MutationLike<TVars> {
  mutateAsync: (vars: TVars) => Promise<unknown>;
  isPending: boolean;
  error: unknown;
}

interface RecordFormOptions<TFields, TInput> {
  initial: TFields | (() => TFields);
  build: (fields: TFields) => BuildResult<TInput>;
  create: MutationLike<TInput>;
  update: MutationLike<{ recordId: number; input: TInput }>;
  recordId?: number; // definido = editando este registro
  errorFallback: string;
  onSuccess: () => void;
}

export function useRecordForm<TFields, TInput>({
  initial,
  build,
  create,
  update,
  recordId,
  errorFallback,
  onSuccess,
}: RecordFormOptions<TFields, TInput>) {
  const [fields, setFields] = useState<TFields>(initial);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEditing = recordId !== undefined;
  const active = isEditing ? update : create;

  const setField = useCallback(
    <K extends keyof TFields>(key: K, value: TFields[K]) => setFields((current) => ({ ...current, [key]: value })),
    []
  );

  const onSubmit = async () => {
    setValidationError(null);

    const result = build(fields);
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    try {
      if (isEditing) await update.mutateAsync({ recordId, input: result.input });
      else await create.mutateAsync(result.input);
      onSuccess();
    } catch {
      // o erro aparece em errorMessage
    }
  };

  const errorMessage = validationError ?? (active.error ? getErrorMessage(active.error, errorFallback) : null);

  return { fields, setField, footer: { errorMessage, isPending: active.isPending, isEditing, onSubmit } };
}
