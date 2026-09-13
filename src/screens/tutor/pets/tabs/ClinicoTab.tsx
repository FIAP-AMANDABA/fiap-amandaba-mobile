import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Doenca } from '../../../../interfaces/doenca';
import type { Alergia } from '../../../../interfaces/alergia';
import type { Medicamento } from '../../../../interfaces/medicamento';
import { getDoencasByPet } from '../../../../services/doencaService';
import { getAlergiasByPet } from '../../../../services/alergiaService';
import { getMedicamentosByPet } from '../../../../services/medicamentoService';
import { formatDateBr } from '../../../../services/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { DoencaForm } from '../forms/DoencaForm';
import { AlergiaForm } from '../forms/AlergiaForm';
import { MedicamentoForm } from '../forms/MedicamentoForm';
import { petDetailStyles as styles } from '../../../../styles/tutor/petDetail.styles';

interface ClinicoTabProps {
  petId: number;
}

type ModalKey = 'doenca' | 'alergia' | 'medicamento' | null;

export function ClinicoTab({ petId }: ClinicoTabProps) {
  const [doencas, setDoencas] = useState<Doenca[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getDoencasByPet(petId).catch(() => []),
      getAlergiasByPet(petId).catch(() => []),
      getMedicamentosByPet(petId).catch(() => []),
    ])
      .then(([doencasData, alergiasData, medicamentosData]) => {
        if (cancelled) return;
        setDoencas(doencasData);
        setAlergias(alergiasData);
        setMedicamentos(medicamentosData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [petId, reloadToken]);

  const handleAdded = () => {
    setOpenModal(null);
    setReloadToken((token) => token + 1);
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DOENÇAS</Text>
          <TouchableOpacity onPress={() => setOpenModal('doenca')}>
            <Text style={styles.addLink}>+ ADICIONAR</Text>
          </TouchableOpacity>
        </View>
        {!loading &&
          (doencas.length === 0 ? (
            <EmptyState message="Nenhuma doença registrada." />
          ) : (
            doencas.map((doenca) => (
              <RecordCard
                key={doenca.idRegistroDoenca}
                title={doenca.nome}
                badge={doenca.status}
                lines={[
                  [doenca.tratamento, doenca.dataDiagnostico ? `diagnóstico ${formatDateBr(doenca.dataDiagnostico)}` : null]
                    .filter(Boolean)
                    .join(' · '),
                ]}
              />
            ))
          ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALERGIAS</Text>
          <TouchableOpacity onPress={() => setOpenModal('alergia')}>
            <Text style={styles.addLink}>+ ADICIONAR</Text>
          </TouchableOpacity>
        </View>
        {!loading &&
          (alergias.length === 0 ? (
            <EmptyState message="Nenhuma alergia registrada." />
          ) : (
            alergias.map((alergia) => (
              <RecordCard
                key={alergia.idRegistroAlergia}
                title={alergia.nome}
                badge={alergia.gravidade ?? undefined}
                lines={[[alergia.tipo, alergia.reacao].filter(Boolean).join(' · ')]}
              />
            ))
          ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MEDICAMENTOS</Text>
          <TouchableOpacity onPress={() => setOpenModal('medicamento')}>
            <Text style={styles.addLink}>+ ADICIONAR</Text>
          </TouchableOpacity>
        </View>
        {!loading &&
          (medicamentos.length === 0 ? (
            <EmptyState message="Nenhum medicamento registrado." />
          ) : (
            medicamentos.map((medicamento) => (
              <RecordCard
                key={medicamento.idRegistroMedicamento}
                title={medicamento.nome}
                badge={medicamento.status}
                lines={[
                  [
                    medicamento.dosagem ? `${medicamento.dosagem} ${medicamento.unidade ?? ''}`.trim() : null,
                    medicamento.frequencia,
                    medicamento.administracao,
                  ]
                    .filter(Boolean)
                    .join(' · '),
                  [
                    medicamento.dataTermino
                      ? `${formatDateBr(medicamento.dataInicio)} → ${formatDateBr(medicamento.dataTermino)}`
                      : `Desde ${formatDateBr(medicamento.dataInicio)}`,
                    medicamento.motivo,
                  ]
                    .filter(Boolean)
                    .join(' · '),
                ]}
              />
            ))
          ))}
      </View>

      <FormModal visible={openModal === 'doenca'} title="Nova doença" onClose={() => setOpenModal(null)}>
        <DoencaForm petId={petId} onSuccess={handleAdded} />
      </FormModal>
      <FormModal visible={openModal === 'alergia'} title="Nova alergia" onClose={() => setOpenModal(null)}>
        <AlergiaForm petId={petId} onSuccess={handleAdded} />
      </FormModal>
      <FormModal visible={openModal === 'medicamento'} title="Novo medicamento" onClose={() => setOpenModal(null)}>
        <MedicamentoForm petId={petId} onSuccess={handleAdded} />
      </FormModal>
    </View>
  );
}
