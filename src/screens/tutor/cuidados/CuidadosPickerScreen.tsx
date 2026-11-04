import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CuidadosStackParamList } from '../../../interfaces/navigation';
import { usePets } from '../../../hooks/usePets';
import { getErrorMessage } from '../../../services/http';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { formatEnumLabel } from '../../../utils/formatUtils';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createCuidadosStyles } from '../../../styles/tutor/cuidados.styles';

type Props = NativeStackScreenProps<CuidadosStackParamList, 'CuidadosPicker'>;

export default function CuidadosPickerScreen({ navigation }: Props) {
  const styles = useThemedStyles(createCuidadosStyles);
  const { palette } = useTheme();
  const { data: pets = [], isLoading, error } = usePets();

  if (isLoading) return <ScreenLoading />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="CUIDADOS"
          info={{
            title: 'Plano de cuidados',
            text: 'Escolha um pet para ver o plano de cuidados gerado por IA. Ele cruza os medicamentos, as alergias e as doenças registradas do pet e devolve um plano diário.',
          }}
        />

        {error && <EmptyState message={getErrorMessage(error, 'Erro ao carregar pets.')} />}

        {pets.length === 0 ? (
          <EmptyState message="Nenhum pet cadastrado ainda." />
        ) : (
          <View style={styles.list}>
            {pets.map((pet) => {
              const details = [formatEnumLabel(pet.especie), pet.raca].filter(Boolean).join(' · ');
              return (
                <TouchableOpacity
                  key={pet.idPet}
                  style={styles.petRow}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('CuidadosPlano', { petId: pet.idPet })}
                >
                  <View style={styles.photo}>
                    {pet.fotoUrl ? (
                      <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
                    ) : (
                      <Ionicons name="image-outline" size={22} color={palette.textMuted} />
                    )}
                  </View>
                  <View style={styles.petInfo}>
                    <View style={styles.petNameRow}>
                      <Text style={styles.petName}>{pet.nome.toUpperCase()}</Text>
                      <StatusBadge status={pet.status} />
                    </View>
                    {details ? <Text style={styles.petDetails}>{details}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
