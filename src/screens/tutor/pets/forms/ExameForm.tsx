import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createExame } from '../../../../services/exameService';
import { parseBrDate } from '../../../../services/dateUtils';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { GradientButton } from '../../../../components/GradientButton';
import { petFormStyles as styles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'SOLICITADO', value: 'SOLICITADO' },
  { label: 'REALIZADO', value: 'REALIZADO' },
  { label: 'RESULTADO DISPONÍVEL', value: 'RESULTADO_DISPONIVEL' },
];

interface ExameFormProps {
  petId: number;
  onSuccess: () => void;
}

export function ExameForm({ petId, onSuccess }: ExameFormProps) {
  const [nome, setNome] = useState('');
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [dataRealizacao, setDataRealizacao] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [clinica, setClinica] = useState('');
  const [motivo, setMotivo] = useState('');
  const [resultado, setResultado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!nome.trim()) {
      setError('Informe o nome do exame.');
      return;
    }
    if (!status) {
      setError('Selecione o status.');
      return;
    }

    setSubmitting(true);
    try {
      await createExame(petId, {
        nome: nome.trim(),
        dataSolicitacao: parseBrDate(dataSolicitacao),
        dataRealizacao: parseBrDate(dataRealizacao),
        veterinario: veterinario.trim() || undefined,
        clinica: clinica.trim() || undefined,
        motivo: motivo.trim() || undefined,
        resultado: resultado.trim() || undefined,
        observacao: observacao.trim() || undefined,
        status: status as 'SOLICITADO' | 'REALIZADO' | 'RESULTADO_DISPONIVEL',
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar exame.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormInput placeholder="NOME DO EXAME *" value={nome} onChangeText={setNome} maxLength={150} />
      <FormInput
        placeholder="DATA DE SOLICITAÇÃO  ·  dd/mm/aaaa"
        value={dataSolicitacao}
        onChangeText={setDataSolicitacao}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput
        placeholder="DATA DE REALIZAÇÃO  ·  dd/mm/aaaa"
        value={dataRealizacao}
        onChangeText={setDataRealizacao}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput placeholder="VETERINÁRIO" value={veterinario} onChangeText={setVeterinario} maxLength={150} />
      <FormInput placeholder="CLÍNICA" value={clinica} onChangeText={setClinica} maxLength={150} />
      <FormInput placeholder="MOTIVO" value={motivo} onChangeText={setMotivo} maxLength={500} />
      <FormInput
        placeholder="RESULTADO"
        value={resultado}
        onChangeText={setResultado}
        maxLength={4000}
        multiline
      />
      <FormInput
        placeholder="OBSERVAÇÃO"
        value={observacao}
        onChangeText={setObservacao}
        maxLength={2000}
        multiline
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>STATUS *</Text>
        <PillSelector options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.submitButton}>
        <GradientButton
          label={submitting ? 'ENVIANDO...' : 'REGISTRAR EXAME'}
          onPress={submitting ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
