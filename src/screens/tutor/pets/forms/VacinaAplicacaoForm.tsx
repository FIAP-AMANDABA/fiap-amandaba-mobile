import { View, Text, ActivityIndicator } from 'react-native';
import { useCreateVacina, useVacinaCatalogo, useUpdateVacina } from '../../../../hooks/useVacinas';
import { useRecordForm } from '../../../../hooks/useRecordForm';
import type { VacinaAplicacao } from '../../../../interfaces/vacina';
import { vacinaToFields } from '../../../../domain/recordForms';
import { buildVacinaInput, type VacinaFormFields } from '../../../../domain/recordInputs';
import { getErrorMessage } from '../../../../services/http';
import { FormFooter } from '../../../../components/FormFooter';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../../styles/tutor/petForm.styles';

interface VacinaAplicacaoFormProps {
  petId: number;
  onSuccess: () => void;
  record?: VacinaAplicacao;
}

const EMPTY_FIELDS: VacinaFormFields = {
  idVacina: null,
  dataAplicacao: '',
  numeroDose: '',
  numeroLote: '',
  proximaDose: '',
  clinica: '',
  observacao: '',
};

export function VacinaAplicacaoForm({ petId, onSuccess, record }: VacinaAplicacaoFormProps) {
  const styles = useThemedStyles(createPetFormStyles);
  const { palette } = useTheme();

  const { data: catalogo = [], isLoading: loadingCatalogo, error: catalogoError } = useVacinaCatalogo();
  const catalogErrorMessage = catalogoError ? getErrorMessage(catalogoError, 'Erro ao carregar vacinas.') : null;
  const { fields, setField, footer } = useRecordForm({
    initial: record ? vacinaToFields(record) : EMPTY_FIELDS,
    build: buildVacinaInput,
    create: useCreateVacina(petId),
    update: useUpdateVacina(petId),
    recordId: record?.idAplicacaoVacina,
    errorFallback: 'Erro ao salvar vacina.',
    onSuccess,
  });

  return (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>VACINA *</Text>
        {loadingCatalogo ? (
          <ActivityIndicator color={palette.greenDark} />
        ) : (
          <PillSelector
            options={catalogo.map((vacina) => ({
              label: vacina.nome.toUpperCase(),
              value: String(vacina.idVacina),
            }))}
            value={fields.idVacina}
            onChange={(value) => setField('idVacina', value)}
          />
        )}
      </View>

      <FormInput
        placeholder="DATA DE APLICAÇÃO *  ·  dd/mm/aaaa"
        value={fields.dataAplicacao}
        onChangeText={(value) => setField('dataAplicacao', value)}
        mask="date"
      />
      <FormInput
        placeholder="NÚMERO DA DOSE  ·  ex. 1"
        value={fields.numeroDose}
        onChangeText={(value) => setField('numeroDose', value)}
        keyboardType="numeric"
      />
      <FormInput
        placeholder="LOTE"
        value={fields.numeroLote}
        onChangeText={(value) => setField('numeroLote', value)}
        maxLength={50}
      />
      <FormInput
        placeholder="PRÓXIMA DOSE  ·  dd/mm/aaaa"
        value={fields.proximaDose}
        onChangeText={(value) => setField('proximaDose', value)}
        mask="date"
      />
      <FormInput
        placeholder="CLÍNICA"
        value={fields.clinica}
        onChangeText={(value) => setField('clinica', value)}
        maxLength={150}
      />
      <FormInput
        placeholder="OBSERVAÇÃO"
        value={fields.observacao}
        onChangeText={(value) => setField('observacao', value)}
        maxLength={1000}
        multiline
      />

      <FormFooter {...footer} errorMessage={footer.errorMessage ?? catalogErrorMessage} createLabel="REGISTRAR VACINA" />
    </>
  );
}
