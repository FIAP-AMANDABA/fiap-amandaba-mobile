import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import type { Especie } from '../../../interfaces/especie';
import { getEspecies } from '../../../services/especieService';
import { createPet } from '../../../services/petService';
import { getCurrentTutor } from '../../../services/tutorService';
import { parseBrDate } from '../../../services/dateUtils';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { FormInput } from '../../../components/FormInput';
import { PillSelector } from '../../../components/PillSelector';
import { ToggleRow } from '../../../components/ToggleRow';
import { GradientButton } from '../../../components/GradientButton';
import { petFormStyles as styles } from '../../../styles/tutor/petForm.styles';
import { colors } from '../../../styles/colors';

// Valores no padrão observado nos dados reais da API (ex.: pets do tutor #1).
const SEXO_OPTIONS = [
  { label: 'FÊMEA', value: 'FEMEA' },
  { label: 'MACHO', value: 'MACHO' },
];

type Props = NativeStackScreenProps<PetsStackParamList, 'PetForm'>;

export default function PetFormScreen({ navigation }: Props) {
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [loadingEspecies, setLoadingEspecies] = useState(true);

  const [especieValue, setEspecieValue] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [raca, setRaca] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cor, setCor] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [sexo, setSexo] = useState<string | null>(null);
  const [castrado, setCastrado] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getEspecies()
      .then((data) => {
        if (!cancelled) setEspecies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar espécies.');
      })
      .finally(() => {
        if (!cancelled) setLoadingEspecies(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!especieValue) {
      setError('Selecione a espécie do pet.');
      return;
    }
    if (!nome.trim()) {
      setError('Informe o nome do pet.');
      return;
    }

    const tutor = await getCurrentTutor();
    if (!tutor) {
      setError('Não foi possível identificar o tutor logado.');
      return;
    }

    setSubmitting(true);
    try {
      await createPet(tutor.idTutor, {
        idEspecie: Number(especieValue),
        nome: nome.trim(),
        fotoUrl: fotoUrl.trim() || undefined,
        raca: raca.trim() || undefined,
        dataNascimento: parseBrDate(dataNascimento),
        cor: cor.trim() || undefined,
        microchip: microchip.trim() || undefined,
        sexo: sexo ?? undefined,
        castrado,
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar pet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="CADASTRAR PET" onBack={() => navigation.goBack()} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ESPÉCIE *</Text>
          {loadingEspecies ? (
            <ActivityIndicator color={colors.purple} />
          ) : (
            <PillSelector
              options={especies.map((especie) => ({
                label: especie.nome.toUpperCase(),
                value: String(especie.idEspecie),
              }))}
              value={especieValue}
              onChange={setEspecieValue}
            />
          )}
        </View>

        <FormInput placeholder="NOME DO PET *" value={nome} onChangeText={setNome} maxLength={100} />
        <FormInput placeholder="URL DA FOTO" value={fotoUrl} onChangeText={setFotoUrl} maxLength={500} />
        <FormInput placeholder="RAÇA" value={raca} onChangeText={setRaca} maxLength={100} />
        <FormInput
          placeholder="DATA DE NASCIMENTO  ·  dd/mm/aaaa"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="numeric"
          maxLength={10}
        />
        <FormInput placeholder="COR" value={cor} onChangeText={setCor} maxLength={50} />
        <FormInput placeholder="MICROCHIP" value={microchip} onChangeText={setMicrochip} maxLength={50} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SEXO</Text>
          <PillSelector options={SEXO_OPTIONS} value={sexo} onChange={setSexo} />
        </View>

        <ToggleRow label="CASTRADO" value={castrado} onChange={setCastrado} />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={submitting ? 'ENVIANDO...' : 'FINALIZAR CADASTRO'}
            onPress={submitting ? undefined : handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
