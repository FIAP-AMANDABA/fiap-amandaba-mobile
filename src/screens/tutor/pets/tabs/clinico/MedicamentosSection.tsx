import { View } from 'react-native';
import type { Medicamento, MedicamentoStatus } from '../../../../../interfaces/medicamento';
import { useChangeMedicamentoStatus, useDeleteMedicamento, useMedicamentos } from '../../../../../hooks/useClinico';
import { useFormTarget, useRecordDeletion, useStatusDialog } from '../../../../../hooks/useRecordDialogs';
import { formatDateBr } from '../../../../../utils/dateUtils';
import { RecordCard } from '../../../../../components/RecordCard';
import { RecordActions } from '../../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../../components/SectionAddHeader';
import { EmptyState } from '../../../../../components/EmptyState';
import { FormModal } from '../../../../../components/FormModal';
import { DeleteRecordModal } from '../../../../../components/DeleteRecordModal';
import { StatusChangeModal } from '../../../../../components/StatusChangeModal';
import { MedicamentoForm } from '../../forms/MedicamentoForm';
import { useThemedStyles } from '../../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../../styles/tutor/petDetail.styles';

const STATUS_OPTIONS = [
  { label: 'EM USO', value: 'EM_USO' },
  { label: 'CONCLUÍDO', value: 'CONCLUIDO' },
  { label: 'SUSPENSO', value: 'SUSPENSO' },
];

function describe(medicamento: Medicamento): string[] {
  const dose = medicamento.dosagem ? `${medicamento.dosagem} ${medicamento.unidade ?? ''}`.trim() : null;
  const period = medicamento.dataTermino
    ? `${formatDateBr(medicamento.dataInicio)} → ${formatDateBr(medicamento.dataTermino)}`
    : `Desde ${formatDateBr(medicamento.dataInicio)}`;

  return [
    [dose, medicamento.frequencia, medicamento.administracao].filter(Boolean).join(' · '),
    medicamento.horario ? `Horários: ${medicamento.horario}` : '',
    [period, medicamento.motivo].filter(Boolean).join(' · '),
  ].filter(Boolean);
}

export function MedicamentosSection({ petId }: { petId: number }) {
  const styles = useThemedStyles(createPetDetailStyles);
  const { data: medicamentos = [], isLoading } = useMedicamentos(petId);

  const form = useFormTarget<Medicamento>();
  const removal = useRecordDeletion<Medicamento>(
    useDeleteMedicamento(petId),
    (medicamento) => medicamento.idRegistroMedicamento,
    (medicamento) => medicamento.nome
  );
  const status = useStatusDialog<Medicamento, MedicamentoStatus>(
    useChangeMedicamentoStatus(petId),
    (medicamento) => medicamento.idRegistroMedicamento
  );

  return (
    <View style={styles.section}>
      <SectionAddHeader title="MEDICAMENTOS" onAdd={form.openNew} />

      {!isLoading &&
        (medicamentos.length === 0 ? (
          <EmptyState message="Nenhum medicamento registrado." />
        ) : (
          medicamentos.map((medicamento) => (
            <View key={medicamento.idRegistroMedicamento} style={styles.recordBlock}>
              <RecordCard title={medicamento.nome} badge={medicamento.status} lines={describe(medicamento)} />
              <RecordActions
                actions={[
                  { label: 'ALTERAR STATUS', onPress: () => status.open(medicamento) },
                  { label: 'EDITAR', onPress: () => form.openEdit(medicamento) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(medicamento) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar medicamento' : 'Novo medicamento'}
        onClose={form.close}
      >
        {form.target && <MedicamentoForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <StatusChangeModal
        {...status.modalProps}
        title="Status do medicamento"
        options={STATUS_OPTIONS}
        current={status.target?.status ?? null}
      />

      <DeleteRecordModal {...removal.modalProps} />
    </View>
  );
}
