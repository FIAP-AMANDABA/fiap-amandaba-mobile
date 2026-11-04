import { View } from 'react-native';
import type { Doenca } from '../../../../../interfaces/doenca';
import { useDeleteDoenca, useDoencas } from '../../../../../hooks/useClinico';
import { useFormTarget, useRecordDeletion } from '../../../../../hooks/useRecordDialogs';
import { formatDateBr } from '../../../../../utils/dateUtils';
import { RecordCard } from '../../../../../components/RecordCard';
import { RecordActions } from '../../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../../components/SectionAddHeader';
import { EmptyState } from '../../../../../components/EmptyState';
import { FormModal } from '../../../../../components/FormModal';
import { DeleteRecordModal } from '../../../../../components/DeleteRecordModal';
import { DoencaForm } from '../../forms/DoencaForm';
import { useThemedStyles } from '../../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../../styles/tutor/petDetail.styles';

export function DoencasSection({ petId }: { petId: number }) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: doencas = [], isLoading } = useDoencas(petId);

  const form = useFormTarget<Doenca>();
  const removal = useRecordDeletion<Doenca>(
    useDeleteDoenca(petId),
    (doenca) => doenca.idRegistroDoenca,
    (doenca) => doenca.nome
  );

  return (
    <View style={styles.section}>
      <SectionAddHeader title="DOENÇAS" onAdd={form.openNew} />

      {!isLoading &&
        (doencas.length === 0 ? (
          <EmptyState message="Nenhuma doença registrada." />
        ) : (
          doencas.map((doenca) => (
            <View key={doenca.idRegistroDoenca} style={styles.recordBlock}>
              <RecordCard
                title={doenca.nome}
                badge={doenca.status}
                lines={[
                  [doenca.tratamento, doenca.dataDiagnostico ? `diagnóstico ${formatDateBr(doenca.dataDiagnostico)}` : null]
                    .filter(Boolean)
                    .join(' · '),
                ]}
              />
              <RecordActions
                actions={[
                  { label: 'EDITAR', onPress: () => form.openEdit(doenca) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(doenca) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar doença' : 'Nova doença'}
        onClose={form.close}
      >
        {form.target && <DoencaForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <DeleteRecordModal {...removal.modalProps} />
    </View>
  );
}
