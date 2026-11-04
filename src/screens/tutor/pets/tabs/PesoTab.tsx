import { useState } from 'react';
import { View, Text } from 'react-native';
import type { Peso } from '../../../../interfaces/peso';
import { useDeletePeso, usePesos, useRegisterPeso } from '../../../../hooks/usePesos';
import { buildPesoInput } from '../../../../domain/recordInputs';
import { getErrorMessage } from '../../../../services/http';
import { formatDateBr } from '../../../../utils/dateUtils';
import { formatWeight } from '../../../../utils/formatUtils';
import { CurrentWeightCard } from '../../../../components/CurrentWeightCard';
import { GradientButton } from '../../../../components/GradientButton';
import { FormInput } from '../../../../components/FormInput';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { RecordActions } from '../../../../components/RecordActions';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { PesoForm } from '../forms/PesoForm';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';

interface PesoTabProps {
  petId: number;
}

export function PesoTab({ petId }: PesoTabProps) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: pesos = [], isLoading, error: loadError } = usePesos(petId);
  const registerPeso = useRegisterPeso(petId);
  const deletePeso = useDeletePeso(petId);

  const [showForm, setShowForm] = useState(false);
  const [novoPeso, setNovoPeso] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Peso | null>(null);
  const [deleting, setDeleting] = useState<Peso | null>(null);

  const handleRegister = async () => {
    setValidationError(null);

    const result = buildPesoInput(novoPeso);
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    try {
      await registerPeso.mutateAsync(result.input);
      setNovoPeso('');
      setShowForm(false);
    } catch {
      // a mensagem fica em registerPeso.error
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deletePeso.mutateAsync(deleting.idHistoricoPeso);
      setDeleting(null);
    } catch {
      // a mensagem aparece no modal (deletePeso.error)
    }
  };

  if (isLoading) return null;

  const errorMessage =
    validationError ??
    (registerPeso.error ? getErrorMessage(registerPeso.error, 'Erro ao registrar peso.') : null) ??
    (loadError ? getErrorMessage(loadError, 'Erro ao carregar peso.') : null);

  const atual = pesos[0];
  const historico = pesos.slice(1);

  const actionsFor = (peso: Peso) => [
    { label: 'EDITAR', onPress: () => setEditing(peso) },
    {
      label: 'EXCLUIR',
      destructive: true,
      onPress: () => {
        deletePeso.reset();
        setDeleting(peso);
      },
    },
  ];

  return (
    <View style={styles.tabContent}>
      {atual ? (
        <View style={styles.recordBlock}>
          <CurrentWeightCard peso={atual.peso} dataMedicao={formatDateBr(atual.dataMedicao)} />
          <RecordActions actions={actionsFor(atual)} />
        </View>
      ) : (
        <EmptyState message="Nenhuma medição de peso registrada." />
      )}

      {showForm ? (
        <View style={styles.section}>
          <FormInput
            placeholder="PESO EM KG"
            value={novoPeso}
            onChangeText={setNovoPeso}
            keyboardType="decimal-pad"
          />
          <GradientButton
            label={registerPeso.isPending ? 'SALVANDO...' : 'SALVAR PESO'}
            onPress={registerPeso.isPending ? undefined : handleRegister}
          />
        </View>
      ) : (
        <GradientButton label="REGISTRAR PESO" onPress={() => setShowForm(true)} />
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HISTÓRICO</Text>
        {historico.length === 0 ? (
          <EmptyState message="Sem histórico anterior." />
        ) : (
          <View style={styles.historyList}>
            {historico.map((item) => (
              <View key={item.idHistoricoPeso} style={styles.recordBlock}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyValue}>{formatWeight(item.peso)} kg</Text>
                  <Text style={styles.historyDate}>{formatDateBr(item.dataMedicao)}</Text>
                </View>
                <RecordActions actions={actionsFor(item)} />
              </View>
            ))}
          </View>
        )}
      </View>

      <FormModal visible={editing !== null} title="Editar medição" onClose={() => setEditing(null)}>
        {editing && <PesoForm petId={petId} record={editing} onSuccess={() => setEditing(null)} />}
      </FormModal>

      <DeleteRecordModal
        visible={deleting !== null}
        recordLabel={deleting ? `${formatWeight(deleting.peso)} kg · ${formatDateBr(deleting.dataMedicao)}` : ''}
        isPending={deletePeso.isPending}
        errorMessage={deletePeso.error ? getErrorMessage(deletePeso.error, 'Não foi possível excluir.') : null}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </View>
  );
}
