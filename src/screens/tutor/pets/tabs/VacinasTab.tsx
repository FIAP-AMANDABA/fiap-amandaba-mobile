import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { VacinaAplicacao } from '../../../../interfaces/vacina';
import { getVacinasByPet } from '../../../../services/vacinaService';
import { formatDateBr } from '../../../../services/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { VacinaAplicacaoForm } from '../forms/VacinaAplicacaoForm';
import { colors } from '../../../../styles/colors';
import { petDetailStyles as styles } from '../../../../styles/tutor/petDetail.styles';

interface VacinasTabProps {
  petId: number;
}

export function VacinasTab({ petId }: VacinasTabProps) {
  const [vacinas, setVacinas] = useState<VacinaAplicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getVacinasByPet(petId)
      .then((data) => {
        if (!cancelled) setVacinas(data);
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
        <Text style={styles.sectionTitle}>VACINAS</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addLink}>+ ADICIONAR</Text>
        </TouchableOpacity>
      </View>

      {!loading &&
        (vacinas.length === 0 ? (
          <EmptyState message="Nenhuma vacina aplicada registrada." />
        ) : (
          vacinas.map((aplicacao) => (
            <RecordCard
              key={aplicacao.idAplicacaoVacina}
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
                rightColor: colors.greenDark,
              }}
            />
          ))
        ))}

      <FormModal visible={showAddModal} title="Nova vacina" onClose={() => setShowAddModal(false)}>
        <VacinaAplicacaoForm
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
