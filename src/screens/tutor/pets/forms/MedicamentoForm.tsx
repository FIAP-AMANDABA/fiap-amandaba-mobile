import { View, Text } from 'react-native';
import { useCreateMedicamento, useUpdateMedicamento } from '../../../../hooks/useClinico';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { Medicamento } from '../../../../interfaces/medicamento';
import { medicamentoToFields } from '../../../../domain/recordForms';
import { buildMedicamentoInput, type MedicamentoFormFields } from '../../../../domain/recordInputs';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'EM USO', value: 'EM_USO' },
  { label: 'CONCLUÍDO', value: 'CONCLUIDO' },
  { label: 'SUSPENSO', value: 'SUSPENSO' },
];

const EMPTY_FIELDS: MedicamentoFormFields = {
  nome: '',
  motivo: '',
  dosagem: '',
  unidade: '',
  frequencia: '',
  administracao: '',
  horarios: '',
  dataInicio: '',
  dataTermino: '',
  status: null,
  observacao: '',
};

interface MedicamentoFormProps {
  petId: number;
  onSuccess: () => void;
  record?: Medicamento;
}

export function MedicamentoForm({ petId, onSuccess, record }: MedicamentoFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { fields, setField, footer } = useRecordForm({
    initial: record ? medicamentoToFields(record) : EMPTY_FIELDS,
    build: buildMedicamentoInput,
    create: useCreateMedicamento(petId),
    update: useUpdateMedicamento(petId),
    recordId: record?.idRegistroMedicamento,
    errorFallback: 'Erro ao salvar medicamento.',
    onSuccess,
  });

  return (
    <>
      <FormInput
        placeholder="NOME DO MEDICAMENTO *"
        value={fields.nome}
        onChangeText={(value) => setField('nome', value)}
        maxLength={250}
      />
      <FormInput
        placeholder="MOTIVO"
        value={fields.motivo}
        onChangeText={(value) => setField('motivo', value)}
        maxLength={500}
      />
      <FormInput
        placeholder="DOSAGEM  ·  ex. 10"
        value={fields.dosagem}
        onChangeText={(value) => setField('dosagem', value)}
        keyboardType="numeric"
      />
      <FormInput
        placeholder="UNIDADE  ·  ex. MG"
        value={fields.unidade}
        onChangeText={(value) => setField('unidade', value)}
        maxLength={30}
      />
      <FormInput
        placeholder="FREQUÊNCIA  ·  ex. A CADA 12H"
        value={fields.frequencia}
        onChangeText={(value) => setField('frequencia', value)}
        maxLength={100}
      />
      <FormInput
        placeholder="ADMINISTRAÇÃO  ·  ex. ORAL"
        value={fields.administracao}
        onChangeText={(value) => setField('administracao', value)}
        maxLength={100}
      />
      <FormInput
        placeholder="HORÁRIOS DOS LEMBRETES  ·  ex. 08:00, 20:00"
        value={fields.horarios}
        onChangeText={(value) => setField('horarios', value)}
        maxLength={500}
      />
      <FormInput
        placeholder="DATA DE INÍCIO *  ·  dd/mm/aaaa"
        value={fields.dataInicio}
        onChangeText={(value) => setField('dataInicio', value)}
        mask="date"
      />
      <FormInput
        placeholder="DATA DE TÉRMINO  ·  dd/mm/aaaa"
        value={fields.dataTermino}
        onChangeText={(value) => setField('dataTermino', value)}
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
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={1000}
        multiline
      />

      <FormFooter {...footer} createLabel="REGISTRAR MEDICAMENTO" />
    </>
  );
}
