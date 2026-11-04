import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CuidadosStackParamList } from '../../../interfaces/navigation';
import { usePet } from '../../../hooks/usePets';
import { useGenerateCarePlan, useSavedCarePlan } from '../../../hooks/useCarePlan';
import { getErrorMessage } from '../../../services/http';
import { formatDateTimeBr } from '../../../utils/dateUtils';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { GradientButton } from '../../../components/GradientButton';
import { MarkdownText } from '../../../components/MarkdownText';
import { EmptyState } from '../../../components/EmptyState';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createCuidadosStyles } from '../../../styles/tutor/cuidados.styles';

type Props = NativeStackScreenProps<CuidadosStackParamList, 'CuidadosPlano'>;

export default function CuidadosPlanoScreen({ route, navigation }: Props) {
  const { petId } = route.params;
  const styles = useThemedStyles(createCuidadosStyles);

  const { data: pet, isLoading, error: petError } = usePet(petId);
  const { data: saved } = useSavedCarePlan(petId);
  const generatePlan = useGenerateCarePlan(petId);

  if (isLoading) return <ScreenLoading />;

  if (petError || !pet) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader title="PLANO DE CUIDADOS" onBack={() => navigation.goBack()} />
          <EmptyState message={petError ? getErrorMessage(petError, 'Erro ao carregar pet.') : 'Pet não encontrado.'} />
        </View>
      </SafeAreaView>
    );
  }

  const buttonLabel = generatePlan.isPending
    ? 'GERANDO...'
    : saved
      ? `GERAR NOVO PLANO PARA ${pet.nome.toUpperCase()}`
      : `GERAR PLANO PARA ${pet.nome.toUpperCase()}`;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="PLANO DE CUIDADOS"
          onBack={() => navigation.goBack()}
          info={{
            title: 'Plano de cuidados por IA',
            text: `Gerado por IA a partir do histórico clínico de ${pet.nome}: medicamentos, alergias e doenças registradas. O último plano fica salvo neste aparelho; toque em "Gerar novo plano" para atualizá-lo depois de mudar o histórico.`,
          }}
        />

        <GradientButton
          label={buttonLabel}
          onPress={generatePlan.isPending ? undefined : () => generatePlan.mutate()}
        />

        {generatePlan.isPending && (
          <Text style={styles.placeholderText}>A IA está montando o plano. Isso pode levar até 30 segundos.</Text>
        )}

        {generatePlan.error && (
          <Text style={styles.errorText}>
            {getErrorMessage(generatePlan.error, generatePlan.error.message)}
          </Text>
        )}

        <View style={styles.resultCard}>
          {saved ? (
            <>
              <Text style={styles.generatedAt}>Gerado em {formatDateTimeBr(saved.generatedAt)}</Text>
              <MarkdownText source={saved.plan} />
            </>
          ) : (
            <Text style={styles.placeholderText}>Nenhum plano gerado ainda para {pet.nome}.</Text>
          )}
        </View>

        <Text style={styles.disclaimer}>
          Este plano é uma sugestão automática de uma IA, baseada apenas nos dados cadastrados. Ele não substitui a
          avaliação de um veterinário.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
