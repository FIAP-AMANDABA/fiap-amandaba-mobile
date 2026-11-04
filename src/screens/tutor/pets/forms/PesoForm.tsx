import { useState } from 'react';
import { View, Text } from 'react-native';
import type { Peso } from '../../../../interfaces/peso';
import { useUpdatePeso } from '../../../../hooks/usePesos';
import { pesoToFields } from '../../../../domain/recordForms';
import { buildPesoEditInput } from '../../../../domain/recordInputs';
import { getErrorMessage } from '../../../../services/http';
import { FormInput } from '../../../../components/FormInput';
import { GradientButton } from '../../../../components/GradientButton';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

interface PesoFormProps {
  petId: number;
  record: Peso;
  onSuccess: () => void;
}

export function PesoForm({ petId, record, onSuccess }: PesoFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const updatePeso = useUpdatePeso(petId);

  const [fields, setFields] = useState(() => pesoToFields(record));
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    const result = buildPesoEditInput(fields);
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    try {
      await updatePeso.mutateAsync({ pesoId: record.idHistoricoPeso, ...result.input });
      onSuccess();
    } catch {
      // a mensagem fica em updatePeso.error
    }
  };

  const errorMessage =
    validationError ?? (updatePeso.error ? getErrorMessage(updatePeso.error, 'Erro ao salvar o peso.') : null);

  return (
    <>
      <FormInput
        placeholder="PESO EM KG *"
        value={fields.peso}
        onChangeText={(value) => setFields((current) => ({ ...current, peso: value }))}
        keyboardType="decimal-pad"
      />
      <FormInput
        placeholder="DATA DA MEDIÇÃO *  ·  dd/mm/aaaa"
        value={fields.dataMedicao}
        onChangeText={(value) => setFields((current) => ({ ...current, dataMedicao: value }))}
        mask="date"
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.submitButton}>
        <GradientButton
          label={updatePeso.isPending ? 'ENVIANDO...' : 'SALVAR ALTERAÇÕES'}
          onPress={updatePeso.isPending ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
