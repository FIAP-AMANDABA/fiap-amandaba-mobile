import { useState } from 'react';
import { View, Text } from 'react-native';
import type { Consulta, ConsultaStatus } from '../../../../interfaces/consulta';
import { useConsultas, useDeleteConsulta, useUpdateConsultaStatus } from '../../../../hooks/useConsultas';
import { useFormTarget, useRecordDeletion } from '../../../../hooks/useRecordDialogs';
import { isScheduled } from '../../../../domain/consultas';
import { getErrorMessage } from '../../../../services/http';
import { formatDateBr } from '../../../../utils/dateUtils';
import { formatWeight } from '../../../../utils/formatUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { RecordActions } from '../../../../components/RecordActions';
import { SectionAddHeader } from '../../../../components/SectionAddHeader';
import { DeleteRecordModal } from '../../../../components/DeleteRecordModal';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { ConsultaForm } from '../forms/ConsultaForm';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';
import { createConsultasStyles } from '../../../../styles/tutor/consultas.styles';

interface ConsultasTabProps {
  petId: number;
}

function describe(consulta: Consulta): string[] {
  const quando = [formatDateBr(consulta.dataConsulta), consulta.horario].filter(Boolean).join(' às ');
  const onde = [consulta.veterinario, consulta.clinica].filter(Boolean).join(' · ');

  return [
    quando,
    onde,
    consulta.sintomas ? `Sintomas: ${consulta.sintomas}` : '',
    consulta.peso != null ? `Peso: ${formatWeight(consulta.peso)} kg` : '',
    consulta.diagnostico ? `Diagnóstico: ${consulta.diagnostico}` : '',
    consulta.tratamento ? `Tratamento: ${consulta.tratamento}` : '',
    consulta.observacao ? `Obs.: ${consulta.observacao}` : '',
    consulta.retorno
      ? `Retorno${consulta.dataRetorno ? ` em ${formatDateBr(consulta.dataRetorno)}` : ' necessário'}`
      : '',
  ].filter(Boolean);
}

export function ConsultasTab({ petId }: ConsultasTabProps) {
  const styles = useThemedStyles(createPetDetailStyles);
  const consultaStyles = useThemedStyles(createConsultasStyles);

  const { consultas, isLoading, error } = useConsultas(petId);
  const updateStatus = useUpdateConsultaStatus(petId);

  const form = useFormTarget<Consulta>();
  const removal = useRecordDeletion<Consulta>(
    useDeleteConsulta(petId),
    (consulta) => consulta.idConsulta,
    (consulta) => `${consulta.motivo ?? 'Consulta'} · ${formatDateBr(consulta.dataConsulta)}`
  );
  const [cancelling, setCancelling] = useState<Consulta | null>(null);

  const changeStatus = (consulta: Consulta, status: ConsultaStatus) => {
    updateStatus.reset();
    updateStatus.mutate({ consultaId: consulta.idConsulta, status });
  };

  const confirmCancel = async () => {
    if (!cancelling) return;
    try {
      await updateStatus.mutateAsync({ consultaId: cancelling.idConsulta, status: 'CANCELADA' });
      setCancelling(null);
    } catch {
      // o erro aparece no modal
    }
  };

  return (
    <View style={styles.section}>
      <SectionAddHeader title="CONSULTAS" onAdd={form.openNew} />

      {error && <EmptyState message={getErrorMessage(error, 'Erro ao carregar as consultas.')} />}
      {updateStatus.error && !cancelling && (
        <Text style={consultaStyles.errorText}>
          {getErrorMessage(updateStatus.error, 'Não foi possível atualizar a consulta.')}
        </Text>
      )}

      {!isLoading &&
        !error &&
        (consultas.length === 0 ? (
          <EmptyState message="Nenhuma consulta registrada." />
        ) : (
          consultas.map((consulta) => (
            <View key={consulta.idConsulta} style={styles.recordBlock}>
              <RecordCard title={consulta.motivo ?? 'Consulta'} badge={consulta.status} lines={describe(consulta)} />
              <RecordActions
                actions={[
                  ...(isScheduled(consulta)
                    ? [
                        { label: 'MARCAR COMO REALIZADA', onPress: () => changeStatus(consulta, 'REALIZADA') },
                        { label: 'CANCELAR', destructive: true, onPress: () => setCancelling(consulta) },
                      ]
                    : []),
                  { label: 'EDITAR', onPress: () => form.openEdit(consulta) },
                  { label: 'EXCLUIR', destructive: true, onPress: () => removal.ask(consulta) },
                ]}
              />
            </View>
          ))
        ))}

      <FormModal
        visible={form.target !== null}
        title={form.target?.record ? 'Editar consulta' : 'Nova consulta'}
        onClose={form.close}
      >
        {form.target && <ConsultaForm petId={petId} record={form.target.record} onSuccess={form.close} />}
      </FormModal>

      <DeleteRecordModal {...removal.modalProps} />

      <ConfirmModal
        visible={cancelling !== null}
        title="Cancelar consulta"
        message={`Cancelar a consulta de ${cancelling ? formatDateBr(cancelling.dataConsulta) : ''}? Ela continua no histórico como cancelada.`}
        confirmLabel={updateStatus.isPending ? 'CANCELANDO...' : 'CANCELAR CONSULTA'}
        cancelLabel="VOLTAR"
        errorMessage={updateStatus.error ? getErrorMessage(updateStatus.error, 'Não foi possível cancelar.') : null}
        onCancel={() => setCancelling(null)}
        onConfirm={updateStatus.isPending ? () => undefined : confirmCancel}
      />
    </View>
  );
}
