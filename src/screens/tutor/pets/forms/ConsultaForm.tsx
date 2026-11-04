import { View, Text } from 'react-native';
import { useCreateConsulta, useUpdateConsulta } from '../../../../hooks/useConsultas';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { Consulta } from '../../../../interfaces/consulta';
import { consultaToFields } from '../../../../domain/recordForms';
import { useCurrentProfile } from '../../../../hooks/useProfile';
import { buildConsultaInput, type ConsultaFormFields } from '../../../../domain/recordInputs';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { ToggleRow } from '../../../../components/ToggleRow';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'AGENDADA', value: 'AGENDADA' },
  { label: 'REALIZADA', value: 'REALIZADA' },
  { label: 'CANCELADA', value: 'CANCELADA' },
];

const EMPTY_FIELDS: ConsultaFormFields = {
  dataConsulta: '',
  horario: '',
  veterinario: '',
  clinica: '',
  motivo: '',
  sintomas: '',
  peso: '',
  diagnostico: '',
  tratamento: '',
  observacao: '',
  retorno: false,
  dataRetorno: '',
  status: 'AGENDADA',
};

interface ConsultaFormProps {
  petId: number;
  onSuccess: () => void;
  record?: Consulta;
}

export function ConsultaForm({ petId, onSuccess, record }: ConsultaFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { data: profile } = useCurrentProfile();
  const { fields, setField, footer } = useRecordForm({
    initial: () =>
      record
        ? consultaToFields(record)
        : { ...EMPTY_FIELDS, veterinario: profile?.role === 'VETERINARIO' ? profile.nome : '' },
    build: buildConsultaInput,
    create: useCreateConsulta(petId),
    update: useUpdateConsulta(petId),
    recordId: record?.idConsulta,
    errorFallback: 'Erro ao salvar consulta.',
    onSuccess,
  });

  return (
    <>
      <FormInput
        placeholder="DATA DA CONSULTA *  ·  dd/mm/aaaa"
        value={fields.dataConsulta}
        onChangeText={(value) => setField('dataConsulta', value)}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput
        placeholder="HORÁRIO  ·  ex. 14:30"
        value={fields.horario}
        onChangeText={(value) => setField('horario', value)}
        maxLength={5}
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
        placeholder="SINTOMAS"
        value={fields.sintomas}
        onChangeText={(value) => setField('sintomas', value)}
        maxLength={1000}
        multiline
      />
      <FormInput
        placeholder="PESO NA CONSULTA (KG)"
        value={fields.peso}
        onChangeText={(value) => setField('peso', value)}
        keyboardType="decimal-pad"
      />
      <FormInput
        placeholder="DIAGNÓSTICO"
        value={fields.diagnostico}
        onChangeText={(value) => setField('diagnostico', value)}
        maxLength={2000}
        multiline
      />
      <FormInput
        placeholder="TRATAMENTO"
        value={fields.tratamento}
        onChangeText={(value) => setField('tratamento', value)}
        maxLength={2000}
        multiline
      />
      <FormInput
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={2000}
        multiline
      />

      <ToggleRow label="PRECISA DE RETORNO" value={fields.retorno} onChange={(value) => setField('retorno', value)} />
      {fields.retorno && (
        <FormInput
          placeholder="DATA DO RETORNO  ·  dd/mm/aaaa"
          value={fields.dataRetorno}
          onChangeText={(value) => setField('dataRetorno', value)}
          keyboardType="numeric"
          maxLength={10}
        />
      )}

      <FormFooter {...footer} createLabel="REGISTRAR CONSULTA" />
    </>
  );
}
