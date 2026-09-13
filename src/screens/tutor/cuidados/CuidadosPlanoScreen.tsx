import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CuidadosStackParamList } from '../../../interfaces/navigation';
import type { Pet } from '../../../interfaces/pet';
import { getPetById } from '../../../services/petService';
import { gerarPlanoCuidados } from '../../../services/cuidadosService';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { GradientButton } from '../../../components/GradientButton';
import { EmptyState } from '../../../components/EmptyState';
import { cuidadosStyles as styles } from '../../../styles/tutor/cuidados.styles';
import { colors } from '../../../styles/colors';

type Props = NativeStackScreenProps<CuidadosStackParamList, 'CuidadosPlano'>;

export default function CuidadosPlanoScreen({ route, navigation }: Props) {
  const { petId } = route.params;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [petError, setPetError] = useState<string | null>(null);

  const [plano, setPlano] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPetById(petId)
      .then((data) => {
        if (!cancelled) setPet(data);
      })
      .catch((err) => {
        if (!cancelled) setPetError(err instanceof Error ? err.message : 'Erro ao carregar pet.');
      })
      .finally(() => {
        if (!cancelled) setLoadingPet(false);
      });

    return () => {
      cancelled = true;
    };
  }, [petId]);

  const handleGenerate = async () => {
    setGenerateError(null);
    setGenerating(true);
    try {
      const resultado = await gerarPlanoCuidados(petId);
      setPlano(resultado.planoGerado);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Não foi possível gerar o plano.');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingPet) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (petError || !pet) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader title="PLANO DE CUIDADOS" onBack={() => navigation.goBack()} />
          <EmptyState message={petError ?? 'Pet não encontrado.'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="PLANO DE CUIDADOS" onBack={() => navigation.goBack()} />

        <Text style={styles.planoSubtitle}>
          Gerado por IA a partir do histórico clínico de {pet.nome}: medicamentos em uso, alergias e
          doenças registradas.
        </Text>

        <GradientButton
          label={generating ? 'GERANDO...' : `GERAR PLANO PARA ${pet.nome.toUpperCase()}`}
          onPress={generating ? undefined : handleGenerate}
        />

        {generateError && <Text style={{ color: colors.red }}>{generateError}</Text>}

        <View style={styles.resultCard}>
          {plano ? (
            <Text style={styles.resultText}>{plano}</Text>
          ) : (
            <Text style={styles.placeholderText}>
              Nenhum plano gerado ainda. O resultado é uma sugestão automática e não substitui a
              avaliação do veterinário.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
