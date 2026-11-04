import { View } from 'react-native';
import type { Alergia } from '../../../../../interfaces/alergia';
import { useAlergias, useDeleteAlergia } from '../../../../../hooks/useClinico';
import { useFormTarget, useRecordDeletion } from '../../../../../hooks/useRecordDialogs';
import { RecordCard } from '../../../../../components/RecordCard';
import { RecordActions } from '../../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../../components/SectionAddHeader';
import { EmptyState } from '../../../../../components/EmptyState';
import { FormModal } from '../../../../../components/FormModal';
import { DeleteRecordModal } from '../../../../../components/DeleteRecordModal';
import { AlergiaForm } from '../../forms/AlergiaForm';
import { useThemedStyles } from '../../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../../styles/tutor/petDetail.styles';

export function AlergiasSection({ petId }: { petId: number }) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: alergias = [], isLoading } = useAlergias(petId);

  const form = useFormTarget<Alergia>();
  const removal = useRecordDeletion<Alergia>(
    useDeleteAlergia(petId),
    (alergia) => alergia.idRegistroAlergia,
    (alergia) => alergia.nome
  );

  return (
    <View style={styles.section}>
      <SectionAddHeader title="ALERGIAS" onAdd={form.openNew} />

      {!isLoading &&
        (alergias.length === 0 ? (
          <EmptyState message="Nenhuma alergia registrada." />
        ) : (
          alergias.map((alergia) => (
            <View key={alergia.idRegistroAlergia} style={styles.recordBlock}>
              <RecordCard
                title={alergia.nome}
                badge={alergia.gravidade ?? undefined}
                lines={[[alergia.tipo, alergia.reacao].filter(Boolean).join(' · ')]}
              />
              <RecordActions
                actions={[
                  { label: 'EDITAR', onPress: () => form.openEdit(alergia) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(alergia) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar alergia' : 'Nova alergia'}
        onClose={form.close}
      >
        {form.target && <AlergiaForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <DeleteRecordModal {...removal.modalProps} />
    </View>
  );
}
