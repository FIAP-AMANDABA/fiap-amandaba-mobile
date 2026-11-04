import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../interfaces/navigation';
import { usePacientes } from '../../hooks/useVeterinarios';
import { useCurrentProfile } from '../../hooks/useProfile';
import { useRelatorio } from '../../hooks/useRelatorio';
import { getErrorMessage } from '../../services/http';
import { ScreenHeader } from '../../components/ScreenHeader';
import { PacienteListItem } from '../../components/PacienteListItem';
import { EmptyState } from '../../components/EmptyState';
import { ScreenLoading } from '../../components/ScreenLoading';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { createPetsListStyles } from '../../styles/tutor/petsList.styles';
import { createPacientesStyles } from '../../styles/vet/pacientes.styles';

type Props = NativeStackScreenProps<PetsStackParamList, 'PetsList'>;

export default function PacientesScreen({ navigation }: Props) {
  const styles = useThemedStyles(createPetsListStyles);
  const vetStyles = useThemedStyles(createPacientesStyles);
  const { data: pacientes = [], isLoading, error } = usePacientes();
  const { data: profile } = useCurrentProfile();
  const { data: relatorio = [] } = useRelatorio();

  if (isLoading) return <ScreenLoading />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="PACIENTES"
          info={{
            title: 'Pacientes',
            text: 'Os pets aparecem aqui quando o tutor os compartilha com você. Informe ao tutor o seu nome e o seu CRMV para ele encontrar você no aplicativo.',
          }}
        />
        {profile && (
          <Text style={vetStyles.subtitle}>
            {profile.nome} · {profile.crmv ?? 'CRMV não informado'}
          </Text>
        )}

        {error && <EmptyState message={getErrorMessage(error, 'Erro ao carregar pacientes.')} />}

        {!error && pacientes.length === 0 && <EmptyState message="Nenhum paciente ainda." />}

        <View style={styles.list}>
          {pacientes.map((paciente) => (
            <PacienteListItem
              key={paciente.idPet}
              paciente={paciente}
              resumo={relatorio.find((item) => item.idPet === paciente.idPet)}
              onPress={() => navigation.navigate('PetDetail', { petId: paciente.idPet })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
