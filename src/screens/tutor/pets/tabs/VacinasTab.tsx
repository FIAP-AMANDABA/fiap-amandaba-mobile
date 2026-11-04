import { View } from 'react-native';
import type { VacinaAplicacao } from '../../../../interfaces/vacina';
import { useDeleteVacina, useVacinas } from '../../../../hooks/useVacinas';
import { useFormTarget, useRecordDeletion } from '../../../../hooks/useRecordDialogs';
import { formatDateBr } from '../../../../utils/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { RecordActions } from '../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../components/SectionAddHeader';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { VacinaAplicacaoForm } from '../forms/VacinaAplicacaoForm';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';

interface VacinasTabProps {
  petId: number;
}

export function VacinasTab({ petId }: VacinasTabProps) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: vacinas = [], isLoading } = useVacinas(petId);

  const form = useFormTarget<VacinaAplicacao>();
  const removal = useRecordDeletion<VacinaAplicacao>(
    useDeleteVacina(petId),
    (vacina) => vacina.idAplicacaoVacina,
    (vacina) => vacina.vacina.nome
  );

  return (
    <View style={styles.section}>
      <SectionAddHeader title="VACINAS" onAdd={form.openNew} />

      {!isLoading &&
        (vacinas.length === 0 ? (
          <EmptyState message="Nenhuma vacina aplicada registrada." />
        ) : (
          vacinas.map((aplicacao) => (
            <View key={aplicacao.idAplicacaoVacina} style={styles.recordBlock}>
              <RecordCard
                title={aplicacao.vacina.nome}
                lines={[
                  [
                    aplicacao.numeroDose ? `${aplicacao.numeroDose}ª dose` : null,
                    aplicacao.numeroLote ? `lote ${aplicacao.numeroLote}` : null,
                    aplicacao.clinica,
                  ]
                    .filter(Boolean)
                    .join(' · '),
                ]}
                footer={{
                  left: `Aplicada ${formatDateBr(aplicacao.dataAplicacao)}`,
                  right: aplicacao.proximaDose ? `Próxima ${formatDateBr(aplicacao.proximaDose)}` : undefined,
                }}
              />
              <RecordActions
                actions={[
                  { label: 'EDITAR', onPress: () => form.openEdit(aplicacao) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(aplicacao) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar vacina' : 'Nova vacina'}
        onClose={form.close}
      >
        {form.target && <VacinaAplicacaoForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <DeleteRecordModal {...removal.modalProps} />
    </View>
  );
}
