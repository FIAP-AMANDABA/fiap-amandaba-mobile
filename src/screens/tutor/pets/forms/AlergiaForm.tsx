import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createAlergia } from '../../../../services/alergiaService';
import { parseBrDate } from '../../../../services/dateUtils';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { GradientButton } from '../../../../components/GradientButton';
import { petFormStyles as styles } from '../../../../styles/tutor/petForm.styles';

const TIPO_OPTIONS = [
  { label: 'MEDICAMENTO', value: 'MEDICAMENTO' },
  { label: 'ALIMENTO', value: 'ALIMENTO' },
  { label: 'AMBIENTAL', value: 'AMBIENTAL' },
  { label: 'OUTRO', value: 'OUTRO' },
];

const GRAVIDADE_OPTIONS = [
  { label: 'LEVE', value: 'LEVE' },
  { label: 'MODERADA', value: 'MODERADA' },
  { label: 'GRAVE', value: 'GRAVE' },
];

interface AlergiaFormProps {
  petId: number;
  onSuccess: () => void;
}

export function AlergiaForm({ petId, onSuccess }: AlergiaFormProps) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<string | null>(null);
  const [dataIdentificacao, setDataIdentificacao] = useState('');
  const [reacao, setReacao] = useState('');
  const [gravidade, setGravidade] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!nome.trim()) {
      setError('Informe o nome da alergia.');
      return;
    }

    setSubmitting(true);
    try {
      await createAlergia(petId, {
        nome: nome.trim(),
        tipo: (tipo as 'MEDICAMENTO' | 'ALIMENTO' | 'AMBIENTAL' | 'OUTRO' | null) ?? undefined,
        dataIdentificacao: parseBrDate(dataIdentificacao),
        reacao: reacao.trim() || undefined,
        gravidade: (gravidade as 'LEVE' | 'MODERADA' | 'GRAVE' | null) ?? undefined,
        observacao: observacao.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar alergia.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormInput placeholder="NOME DA ALERGIA *" value={nome} onChangeText={setNome} maxLength={250} />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>TIPO</Text>
        <PillSelector options={TIPO_OPTIONS} value={tipo} onChange={setTipo} />
      </View>

      <FormInput
        placeholder="DATA DE IDENTIFICAÇÃO  ·  dd/mm/aaaa"
        value={dataIdentificacao}
        onChangeText={setDataIdentificacao}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput placeholder="REAÇÃO" value={reacao} onChangeText={setReacao} maxLength={500} />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>GRAVIDADE</Text>
        <PillSelector options={GRAVIDADE_OPTIONS} value={gravidade} onChange={setGravidade} />
      </View>

      <FormInput
        placeholder="OBSERVAÇÃO"
        value={observacao}
        onChangeText={setObservacao}
        maxLength={1000}
        multiline
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.submitButton}>
        <GradientButton
          label={submitting ? 'ENVIANDO...' : 'REGISTRAR ALERGIA'}
          onPress={submitting ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
