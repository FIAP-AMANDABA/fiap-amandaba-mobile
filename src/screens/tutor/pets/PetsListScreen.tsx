import React, { useCallback } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import { usePetsList } from './usePetsList';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { PetListItem } from '../../../components/PetListItem';
import { GradientButton } from '../../../components/GradientButton';
import { EmptyState } from '../../../components/EmptyState';
import { petsListStyles as styles } from '../../../styles/tutor/petsList.styles';
import { colors } from '../../../styles/colors';

type Props = NativeStackScreenProps<PetsStackParamList, 'PetsList'>;

export default function PetsListScreen({ navigation }: Props) {
  const { pets, pesos, loading, error, toggleStatus, reload } = usePetsList();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.purple} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="PETS" />

        {error && <EmptyState message={error} />}

        {pets.length === 0 ? (
          <EmptyState message="Nenhum pet cadastrado ainda." />
        ) : (
          <View style={styles.list}>
            {pets.map((pet) => (
              <PetListItem
                key={pet.idPet}
                pet={pet}
                pesoAtual={pesos[pet.idPet]}
                onPress={() => navigation.navigate('PetDetail', { petId: pet.idPet })}
                onToggleStatus={() => toggleStatus(pet)}
              />
            ))}
          </View>
        )}

        <GradientButton label="CADASTRAR PET" onPress={() => navigation.navigate('PetForm')} />
      </ScrollView>
    </SafeAreaView>
  );
}
