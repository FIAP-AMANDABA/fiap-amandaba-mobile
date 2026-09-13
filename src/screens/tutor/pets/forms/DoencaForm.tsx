import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createDoenca } from '../../../../services/doencaService';
import { parseBrDate } from '../../../../services/dateUtils';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { GradientButton } from '../../../../components/GradientButton';
import { petFormStyles as styles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'ATIVA', value: 'ATIVA' },
  { label: 'CONTROLADA', value: 'CONTROLADA' },
  { label: 'ENCERRADA', value: 'ENCERRADA' },
];

interface DoencaFormProps {
  petId: number;
  onSuccess: () => void;
}

export function DoencaForm({ petId, onSuccess }: DoencaFormProps) {
  const [nome, setNome] = useState('');
  const [dataDiagnostico, setDataDiagnostico] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [tratamento, setTratamento] = useState('');
  const [observacao, setObservacao] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!nome.trim()) {
      setError('Informe o nome da doença.');
      return;
    }
    if (!status) {
      setError('Selecione o status.');
      return;
    }

    setSubmitting(true);
    try {
      await createDoenca(petId, {
        nome: nome.trim(),
        dataDiagnostico: parseBrDate(dataDiagnostico),
        status: status as 'ATIVA' | 'CONTROLADA' | 'ENCERRADA',
        tratamento: tratamento.trim() || undefined,
        observacao: observacao.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar doença.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormInput placeholder="NOME DA DOENÇA *" value={nome} onChangeText={setNome} maxLength={250} />
      <FormInput
        placeholder="DATA DE DIAGNÓSTICO  ·  dd/mm/aaaa"
        value={dataDiagnostico}
        onChangeText={setDataDiagnostico}
        keyboardType="numeric"
        maxLength={10}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>STATUS *</Text>
        <PillSelector options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      </View>

      <FormInput
        placeholder="TRATAMENTO"
        value={tratamento}
        onChangeText={setTratamento}
        maxLength={1000}
        multiline
      />
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
          label={submitting ? 'ENVIANDO...' : 'REGISTRAR DOENÇA'}
          onPress={submitting ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
