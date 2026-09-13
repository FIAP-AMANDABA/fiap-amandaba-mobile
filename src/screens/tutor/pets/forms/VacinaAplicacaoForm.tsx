import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import type { VacinaCatalogo } from '../../../../interfaces/vacina';
import { getVacinaCatalogo, createVacinaAplicacao } from '../../../../services/vacinaService';
import { parseBrDate } from '../../../../services/dateUtils';
import { FormInput } from '../../../../components/FormInput';
import { PillSelector } from '../../../../components/PillSelector';
import { GradientButton } from '../../../../components/GradientButton';
import { petFormStyles as styles } from '../../../../styles/tutor/petForm.styles';
import { colors } from '../../../../styles/colors';

interface VacinaAplicacaoFormProps {
  petId: number;
  onSuccess: () => void;
}

export function VacinaAplicacaoForm({ petId, onSuccess }: VacinaAplicacaoFormProps) {
  const [catalogo, setCatalogo] = useState<VacinaCatalogo[]>([]);
  const [loadingCatalogo, setLoadingCatalogo] = useState(true);

  const [idVacina, setIdVacina] = useState<string | null>(null);
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [numeroDose, setNumeroDose] = useState('');
  const [numeroLote, setNumeroLote] = useState('');
  const [proximaDose, setProximaDose] = useState('');
  const [clinica, setClinica] = useState('');
  const [observacao, setObservacao] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getVacinaCatalogo()
      .then((data) => {
        if (!cancelled) setCatalogo(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar vacinas.');
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalogo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!idVacina) {
      setError('Selecione a vacina.');
      return;
    }
    const dataAplicacaoIso = parseBrDate(dataAplicacao);
    if (!dataAplicacaoIso) {
      setError('Informe a data de aplicação no formato dd/mm/aaaa.');
      return;
    }

    setSubmitting(true);
    try {
      await createVacinaAplicacao(petId, {
        idVacina: Number(idVacina),
        dataAplicacao: dataAplicacaoIso,
        numeroDose: numeroDose ? Number(numeroDose) : undefined,
        numeroLote: numeroLote.trim() || undefined,
        proximaDose: parseBrDate(proximaDose),
        clinica: clinica.trim() || undefined,
        observacao: observacao.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar vacina.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>VACINA *</Text>
        {loadingCatalogo ? (
          <ActivityIndicator color={colors.purple} />
        ) : (
          <PillSelector
            options={catalogo.map((vacina) => ({
              label: vacina.nome.toUpperCase(),
              value: String(vacina.idVacina),
            }))}
            value={idVacina}
            onChange={setIdVacina}
          />
        )}
      </View>

      <FormInput
        placeholder="DATA DE APLICAÇÃO *  ·  dd/mm/aaaa"
        value={dataAplicacao}
        onChangeText={setDataAplicacao}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput
        placeholder="NÚMERO DA DOSE  ·  ex. 1"
        value={numeroDose}
        onChangeText={setNumeroDose}
        keyboardType="numeric"
      />
      <FormInput placeholder="LOTE" value={numeroLote} onChangeText={setNumeroLote} maxLength={50} />
      <FormInput
        placeholder="PRÓXIMA DOSE  ·  dd/mm/aaaa"
        value={proximaDose}
        onChangeText={setProximaDose}
        keyboardType="numeric"
        maxLength={10}
      />
      <FormInput placeholder="CLÍNICA" value={clinica} onChangeText={setClinica} maxLength={150} />
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
          label={submitting ? 'ENVIANDO...' : 'REGISTRAR VACINA'}
          onPress={submitting ? undefined : handleSubmit}
        />
      </View>
    </>
  );
}
