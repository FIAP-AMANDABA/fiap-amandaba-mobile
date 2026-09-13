import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { Peso } from '../../../../interfaces/peso';
import { getPesosByPet, registerPeso } from '../../../../services/pesoService';
import { formatDateBr } from '../../../../services/dateUtils';
import { CurrentWeightCard } from '../../../../components/CurrentWeightCard';
import { GradientButton } from '../../../../components/GradientButton';
import { FormInput } from '../../../../components/FormInput';
import { EmptyState } from '../../../../components/EmptyState';
import { petDetailStyles as styles } from '../../../../styles/tutor/petDetail.styles';

interface PesoTabProps {
  petId: number;
}

export function PesoTab({ petId }: PesoTabProps) {
  const [pesos, setPesos] = useState<Peso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [novoPeso, setNovoPeso] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getPesosByPet(petId)
      .then((data) =>
        setPesos([...data].sort((a, b) => new Date(b.dataMedicao).getTime() - new Date(a.dataMedicao).getTime()))
      )
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar peso.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [petId]);

  const handleRegister = async () => {
    const parsed = Number(novoPeso.replace(',', '.'));
    if (!parsed || parsed <= 0) {
      setError('Informe um peso válido.');
      return;
    }

    setSaving(true);
    try {
      await registerPeso(petId, parsed, new Date().toISOString());
      setNovoPeso('');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar peso.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const atual = pesos[0];
  const historico = pesos.slice(1);

  return (
    <View style={styles.tabContent}>
      {atual ? (
        <CurrentWeightCard peso={atual.peso} dataMedicao={formatDateBr(atual.dataMedicao)} />
      ) : (
        <EmptyState message="Nenhuma medição de peso registrada." />
      )}

      {showForm ? (
        <View style={{ gap: 8 }}>
          <FormInput
            placeholder="PESO EM KG"
            value={novoPeso}
            onChangeText={setNovoPeso}
            keyboardType="decimal-pad"
          />
          <GradientButton label={saving ? 'SALVANDO...' : 'SALVAR PESO'} onPress={saving ? undefined : handleRegister} />
        </View>
      ) : (
        <GradientButton label="REGISTRAR PESO" onPress={() => setShowForm(true)} />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HISTÓRICO</Text>
        {historico.length === 0 ? (
          <EmptyState message="Sem histórico anterior." />
        ) : (
          <View style={{ gap: 8 }}>
            {historico.map((item) => (
              <View key={item.idHistoricoPeso} style={styles.historyRow}>
                <Text style={styles.historyValue}>
                  {item.peso.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg
                </Text>
                <Text style={styles.historyDate}>{formatDateBr(item.dataMedicao)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
