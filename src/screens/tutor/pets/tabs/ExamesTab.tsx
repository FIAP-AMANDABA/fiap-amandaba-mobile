import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Exame } from '../../../../interfaces/exame';
import { getExamesByPet } from '../../../../services/exameService';
import { formatDateBr } from '../../../../services/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { ExameForm } from '../forms/ExameForm';
import { petDetailStyles as styles } from '../../../../styles/tutor/petDetail.styles';

interface ExamesTabProps {
  petId: number;
}

export function ExamesTab({ petId }: ExamesTabProps) {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getExamesByPet(petId)
      .then((data) => {
        if (!cancelled) setExames(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [petId, reloadToken]);

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXAMES</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addLink}>+ ADICIONAR</Text>
        </TouchableOpacity>
      </View>

      {!loading &&
        (exames.length === 0 ? (
          <EmptyState message="Nenhum exame registrado." />
        ) : (
          exames.map((exame) => (
            <RecordCard
              key={exame.idExame}
              title={exame.nome}
              badge={exame.status}
              lines={[
                [exame.clinica, exame.dataSolicitacao ? `solicitado ${formatDateBr(exame.dataSolicitacao)}` : null]
                  .filter(Boolean)
                  .join(' · '),
                exame.resultado ?? undefined,
              ].filter((line): line is string => Boolean(line))}
            />
          ))
        ))}

      <FormModal visible={showAddModal} title="Novo exame" onClose={() => setShowAddModal(false)}>
        <ExameForm
          petId={petId}
          onSuccess={() => {
            setShowAddModal(false);
            setReloadToken((token) => token + 1);
          }}
        />
      </FormModal>
    </View>
  );
}
