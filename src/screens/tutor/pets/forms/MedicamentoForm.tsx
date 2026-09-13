import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createMedicamento } from '../../../../services/medicamentoService';
import { parseBrDate } from '../../../../services/dateUtils';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { GradientButton } from '../../../../components/GradientButton';
import { petFormStyles as styles } from '../../../../styles/tutor/petForm.styles';

const STATUS_OPTIONS = [
  { label: 'EM USO', value: 'EM_USO' },
  { label: 'CONCLUÍDO', value: 'CONCLUIDO' },
  { label: 'SUSPENSO', value: 'SUSPENSO' },
];

interface MedicamentoFormProps {
  petId: number;
  onSuccess: () => void;
}

export function MedicamentoForm({ petId, onSuccess }: MedicamentoFormProps) {
  const [nome, setNome] = useState('');
  const [motivo, setMotivo] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [unidade, setUnidade] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [administracao, setAdministracao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!nome.trim()) {
      setError('Informe o nome do medicamento.');
      return;
    }
    const dataInicioIso = parseBrDate(dataInicio);
    if (!dataInicioIso) {
      setError('Informe a data de início no formato dd/mm/aaaa.');
      return;
    }
    if (!status) {
      setError('Selecione o status.');
      return;
    }

    setSubmitting(true);
    try {
      await createMedicamento(petId, {
        nome: nome.trim(),
        motivo: motivo.trim() || undefined,
        dosagem: dosagem ? Number(dosagem) : undefined,
        unidade: unidade.trim() || undefined,
        frequencia: frequencia.trim() || undefined,
        administracao: administracao.trim() || undefined,
        dataInicio: dataInicioIso,
        dataTermino: parseBrDate(dataTermino),
        status: status as 'EM_USO' | 'CONCLUIDO' | 'SUSPENSO',
        observacao: observacao.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar medicamento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormInput placeholder="NOME DO MEDICAMENTO *" value={nome} onChangeText={setNome} maxLength={250} />
      <FormInput placeholder="MOTIVO" value={motivo} onChangeText={setMotivo} maxLength={500} />
      <FormInput placeholder="DOSAGEM  ·  ex. 10" value={dosagem} onChangeText={setDosagem} keyboardType="numeric" />
      <FormInput placeholder="UNIDADE  ·  ex. MG" value={unidade} onChangeText={setUnidade} maxLength={30} />
      <FormInput
        placeholder="FREQUÊNCIA  ·  ex. A CADA 12H"
        value={frequencia}
        onChangeText={setFrequencia}
        maxLength={100}
      />
      <FormInput
        placeholder="ADMINISTRAÇÃO  ·  ex. ORAL"
        value={administracao}
        onChangeText={setAdministracao}
        maxLength={100}
      />
      <FormInput
        placeholder="DATA DE INÍCIO *  ·  dd/mm/aaaa"
        value={dataInicio}
        onChangeText={setDataInicio}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput
        placeholder="DATA DE TÉRMINO  ·  dd/mm/aaaa"
        value={dataTermino}
        onChangeText={setDataTermino}
        keyboardType="numeric"
        maxLength={10}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>STATUS *</Text>
        <PillSelector options={STATUS_OPTIONS} value={status} onChange={setStatus} />
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
          label={submitting ? 'ENVIANDO...' : 'REGISTRAR MEDICAMENTO'}
          onPress={submitting ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
