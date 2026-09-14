import React, { useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CuidadosStackParamList } from '../../../interfaces/navigation';
import { useTutorPets } from './useTutorPets';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { formatEnumLabel } from '../../../services/formatUtils';
import { cuidadosStyles as styles } from '../../../styles/tutor/cuidados.styles';
import { colors } from '../../../styles/colors';

type Props = NativeStackScreenProps<CuidadosStackParamList, 'CuidadosPicker'>;

export default function CuidadosPickerScreen({ navigation }: Props) {
  const { pets, loading, error, reload } = useTutorPets();

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
        <ScreenHeader title="CUIDADOS" />
        <Text style={styles.subtitle}>Escolha um pet para ver o plano de cuidados gerado por IA.</Text>

        {error && <EmptyState message={error} />}

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
                      <Ionicons name="image-outline" size={22} color={colors.gray} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.petName}>{pet.nome.toUpperCase()}</Text>
                      <StatusBadge status={pet.status} />
                    </View>
                    {details ? <Text style={styles.petDetails}>{details}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.gray} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
