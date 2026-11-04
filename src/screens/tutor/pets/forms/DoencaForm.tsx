import { View, Text } from 'react-native';
import { useCreateDoenca, useUpdateDoenca } from '../../../../hooks/useClinico';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { Doenca } from '../../../../interfaces/doenca';
import { doencaToFields } from '../../../../domain/recordForms';
import { buildDoencaInput, type DoencaFormFields } from '../../../../domain/recordInputs';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'ATIVA', value: 'ATIVA' },
  { label: 'CONTROLADA', value: 'CONTROLADA' },
  { label: 'ENCERRADA', value: 'ENCERRADA' },
];

const EMPTY_FIELDS: DoencaFormFields = {
  nome: '',
  dataDiagnostico: '',
  status: null,
  tratamento: '',
  observacao: '',
};

interface DoencaFormProps {
  petId: number;
  onSuccess: () => void;
  record?: Doenca;
}

export function DoencaForm({ petId, onSuccess, record }: DoencaFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { fields, setField, footer } = useRecordForm({
    initial: record ? doencaToFields(record) : EMPTY_FIELDS,
    build: buildDoencaInput,
    create: useCreateDoenca(petId),
    update: useUpdateDoenca(petId),
    recordId: record?.idRegistroDoenca,
    errorFallback: 'Erro ao salvar doença.',
    onSuccess,
  });

  return (
    <>
      <FormInput
        placeholder="NOME DA DOENÇA *"
        value={fields.nome}
        onChangeText={(value) => setField('nome', value)}
        maxLength={250}
      />
      <FormInput
        placeholder="DATA DE DIAGNÓSTICO  ·  dd/mm/aaaa"
        value={fields.dataDiagnostico}
        onChangeText={(value) => setField('dataDiagnostico', value)}
        mask="date"
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>STATUS *</Text>
        <PillSelector
          options={STATUS_OPTIONS}
          value={fields.status}
          onChange={(value) => setField('status', value)}
        />
      </View>

      <FormInput
        placeholder="TRATAMENTO"
        value={fields.tratamento}
        onChangeText={(value) => setField('tratamento', value)}
        maxLength={1000}
        multiline
      />
      <FormInput
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={1000}
        multiline
      />

      <FormFooter {...footer} createLabel="REGISTRAR DOENÇA" />
    </>
  );
}
