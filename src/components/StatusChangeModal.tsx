import { Text, StyleSheet } from 'react-native';
import { FormModal } from './FormModal';
import { PillSelector } from './PillSelector';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

interface StatusChangeModalProps {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  current: string | null;
  isPending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSelect: (status: string) => void;
}

export function StatusChangeModal({
  visible,
  title,
  options,
  current,
  isPending,
  errorMessage,
  onClose,
  onSelect,
}: StatusChangeModalProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <FormModal visible={visible} title={title} onClose={onClose}>
      <PillSelector
        options={options}
        value={current}
        onChange={(status) => {
          if (!isPending && status !== current) onSelect(status);
        }}
      />
      {isPending && <Text style={styles.hint}>Salvando...</Text>}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </FormModal>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    hint: {
      ...typography.bodySmall,
      color: c.textMuted,
    },
    error: {
      ...typography.bodySmall,
      color: c.red,
    },
  });
