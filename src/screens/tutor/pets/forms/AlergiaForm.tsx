import { View, Text } from 'react-native';
import { useCreateAlergia, useUpdateAlergia } from '../../../../hooks/useClinico';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { Alergia } from '../../../../interfaces/alergia';
import { alergiaToFields } from '../../../../domain/recordForms';
import { buildAlergiaInput, type AlergiaFormFields } from '../../../../domain/recordInputs';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

const TIPO_OPTIONS = [
  { label: 'MEDICAMENTO', value: 'MEDICAMENTO' },
  { label: 'ALIMENTO', value: 'ALIMENTO' },
  { label: 'AMBIENTAL', value: 'AMBIENTAL' },
  { label: 'OUTRO', value: 'OUTRO' },
];

const GRAVIDADE_OPTIONS = [
  { label: 'LEVE', value: 'LEVE' },
  { label: 'MODERADA', value: 'MODERADA' },
  { label: 'GRAVE', value: 'GRAVE' },
];

const EMPTY_FIELDS: AlergiaFormFields = {
  nome: '',
  tipo: null,
  dataIdentificacao: '',
  reacao: '',
  gravidade: null,
  observacao: '',
};

interface AlergiaFormProps {
  petId: number;
  onSuccess: () => void;
  record?: Alergia;
}

export function AlergiaForm({ petId, onSuccess, record }: AlergiaFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { fields, setField, footer } = useRecordForm({
    initial: record ? alergiaToFields(record) : EMPTY_FIELDS,
    build: buildAlergiaInput,
    create: useCreateAlergia(petId),
    update: useUpdateAlergia(petId),
    recordId: record?.idRegistroAlergia,
    errorFallback: 'Erro ao salvar alergia.',
    onSuccess,
  });

  return (
    <>
      <FormInput
        placeholder="NOME DA ALERGIA *"
        value={fields.nome}
        onChangeText={(value) => setField('nome', value)}
        maxLength={250}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>TIPO</Text>
        <PillSelector options={TIPO_OPTIONS} value={fields.tipo} onChange={(value) => setField('tipo', value)} />
      </View>

      <FormInput
        placeholder="DATA DE IDENTIFICAÇÃO  ·  dd/mm/aaaa"
        value={fields.dataIdentificacao}
        onChangeText={(value) => setField('dataIdentificacao', value)}
        mask="date"
      />
      <FormInput
        placeholder="REAÇÃO"
        value={fields.reacao}
        onChangeText={(value) => setField('reacao', value)}
        maxLength={500}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>GRAVIDADE</Text>
        <PillSelector
          options={GRAVIDADE_OPTIONS}
          value={fields.gravidade}
          onChange={(value) => setField('gravidade', value)}
        />
      </View>

      <FormInput
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={1000}
        multiline
      />

      <FormFooter {...footer} createLabel="REGISTRAR ALERGIA" />
    </>
  );
}
