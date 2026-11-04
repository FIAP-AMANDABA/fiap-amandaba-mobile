import { View, Text } from 'react-native';
import { useCreateExame, useUpdateExame } from '../../../../hooks/useExames';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { Exame } from '../../../../interfaces/exame';
import { exameToFields } from '../../../../domain/recordForms';
import { buildExameInput, type ExameFormFields } from '../../../../domain/recordInputs';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'SOLICITADO', value: 'SOLICITADO' },
  { label: 'REALIZADO', value: 'REALIZADO' },
  { label: 'RESULTADO DISPONÍVEL', value: 'RESULTADO_DISPONIVEL' },
];

const EMPTY_FIELDS: ExameFormFields = {
  nome: '',
  dataSolicitacao: '',
  dataRealizacao: '',
  veterinario: '',
  clinica: '',
  motivo: '',
  resultado: '',
  observacao: '',
  status: null,
};

interface ExameFormProps {
  petId: number;
  onSuccess: () => void;
  record?: Exame;
}

export function ExameForm({ petId, onSuccess, record }: ExameFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { fields, setField, footer } = useRecordForm({
    initial: record ? exameToFields(record) : EMPTY_FIELDS,
    build: buildExameInput,
    create: useCreateExame(petId),
    update: useUpdateExame(petId),
    recordId: record?.idExame,
    errorFallback: 'Erro ao salvar exame.',
    onSuccess,
  });

  return (
    <>
      <FormInput
        placeholder="NOME DO EXAME *"
        value={fields.nome}
        onChangeText={(value) => setField('nome', value)}
        maxLength={150}
      />
      <FormInput
        placeholder="DATA DE SOLICITAÇÃO  ·  dd/mm/aaaa"
        value={fields.dataSolicitacao}
        onChangeText={(value) => setField('dataSolicitacao', value)}
        mask="date"
      />
      <FormInput
        placeholder="DATA DE REALIZAÇÃO  ·  dd/mm/aaaa"
        value={fields.dataRealizacao}
        onChangeText={(value) => setField('dataRealizacao', value)}
        mask="date"
      />
      <FormInput
        placeholder="VETERINÁRIO"
        value={fields.veterinario}
        onChangeText={(value) => setField('veterinario', value)}
        maxLength={150}
      />
      <FormInput
        placeholder="CLÍNICA"
        value={fields.clinica}
        onChangeText={(value) => setField('clinica', value)}
        maxLength={150}
      />
      <FormInput
        placeholder="MOTIVO"
        value={fields.motivo}
        onChangeText={(value) => setField('motivo', value)}
        maxLength={500}
      />
      <FormInput
        placeholder="RESULTADO"
        value={fields.resultado}
        onChangeText={(value) => setField('resultado', value)}
        maxLength={4000}
        multiline
      />
      <FormInput
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={2000}
        multiline
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>STATUS *</Text>
        <PillSelector
          options={STATUS_OPTIONS}
          value={fields.status}
          onChange={(value) => setField('status', value)}
        />
      </View>

      <FormFooter {...footer} createLabel="REGISTRAR EXAME" />
    </>
  );
}
