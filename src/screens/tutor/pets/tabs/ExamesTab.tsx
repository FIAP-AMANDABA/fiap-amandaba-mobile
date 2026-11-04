import { View } from 'react-native';
import type { Exame, ExameStatus } from '../../../../interfaces/exame';
import { useChangeExameStatus, useDeleteExame, useExames } from '../../../../hooks/useExames';
import { useFormTarget, useRecordDeletion, useStatusDialog } from '../../../../hooks/useRecordDialogs';
import { formatDateBr } from '../../../../utils/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { RecordActions } from '../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../components/SectionAddHeader';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { StatusChangeModal } from '../../../../components/StatusChangeModal';
import { ExameForm } from '../forms/ExameForm';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';

interface ExamesTabProps {
  petId: number;
}

const STATUS_OPTIONS = [
  { label: 'SOLICITADO', value: 'SOLICITADO' },
  { label: 'REALIZADO', value: 'REALIZADO' },
  { label: 'RESULTADO DISPONÍVEL', value: 'RESULTADO_DISPONIVEL' },
];

export function ExamesTab({ petId }: ExamesTabProps) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: exames = [], isLoading } = useExames(petId);

  const form = useFormTarget<Exame>();
  const removal = useRecordDeletion<Exame>(useDeleteExame(petId), (exame) => exame.idExame, (exame) => exame.nome);
  const status = useStatusDialog<Exame, ExameStatus>(useChangeExameStatus(petId), (exame) => exame.idExame);

  return (
    <View style={styles.section}>
      <SectionAddHeader title="EXAMES" onAdd={form.openNew} />

      {!isLoading &&
        (exames.length === 0 ? (
          <EmptyState message="Nenhum exame registrado." />
        ) : (
          exames.map((exame) => (
            <View key={exame.idExame} style={styles.recordBlock}>
              <RecordCard
                title={exame.nome}
                badge={exame.status}
                lines={[
                  [exame.clinica, exame.dataSolicitacao ? `solicitado ${formatDateBr(exame.dataSolicitacao)}` : null]
                    .filter(Boolean)
                    .join(' · '),
                  exame.resultado ?? undefined,
                ].filter((line): line is string => Boolean(line))}
              />
              <RecordActions
                actions={[
                  { label: 'ALTERAR STATUS', onPress: () => status.open(exame) },
                  { label: 'EDITAR', onPress: () => form.openEdit(exame) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(exame) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar exame' : 'Novo exame'}
        onClose={form.close}
      >
        {form.target && <ExameForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <StatusChangeModal
        {...status.modalProps}
        title="Status do exame"
        options={STATUS_OPTIONS}
        current={status.target?.status ?? null}
      />

      <DeleteRecordModal {...removal.modalProps} />
    </View>
  );
}
