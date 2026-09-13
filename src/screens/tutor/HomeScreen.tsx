import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TutorTabParamList } from '../../interfaces/navigation';
import { useHomeData } from './useHomeData';
import { StatCard } from '../../components/StatCard';
import { CicloSemanaCard } from '../../components/CicloSemanaCard';
import { SectionHeader } from '../../components/SectionHeader';
import { PetCard } from '../../components/PetCard';
import { DoseListItem } from '../../components/DoseListItem';
import { AiCarePlanCard } from '../../components/AiCarePlanCard';
import { EmptyState } from '../../components/EmptyState';
import { homeStyles as styles } from '../../styles/tutor/home.styles';
import { colors } from '../../styles/colors';

type Props = BottomTabScreenProps<TutorTabParamList, 'Inicio'>;

export default function HomeScreen({ navigation }: Props) {
  const { tutor, pets, upcomingDoses, cicloItems, loading, error } = useHomeData();

  const petsAtivos = pets.filter((pet) => pet.status === 'ATIVO').length;
  const ciclosAtrasados = cicloItems.filter((item) => item.overdue).length;

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
        <View style={styles.header}>
          <Text style={styles.tutorLabel}>TUTOR · {tutor?.nome ?? '—'}</Text>
          <Text style={styles.title}>MEUS PETS</Text>
        </View>

        {error && <EmptyState message={error} />}

        <View style={styles.statsRow}>
          <StatCard value={petsAtivos} label="PETS ATIVOS" />
          <StatCard value={upcomingDoses.length} label="DOSES PRÓXIMAS" />
          <StatCard value={ciclosAtrasados} label="CICLOS ATRASADOS" />
        </View>

        <CicloSemanaCard items={cicloItems} />

        <View style={styles.section}>
          <SectionHeader
            title="PETS"
            actionLabel="VER TODOS"
            onPressAction={() => navigation.navigate('Pets')}
          />
          {pets.length === 0 ? (
            <EmptyState message="Nenhum pet cadastrado ainda." />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.petsRow}>
                {pets.map((pet) => (
                  <PetCard key={pet.idPet} pet={pet} />
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="PRÓXIMAS DOSES" />
          {upcomingDoses.length === 0 ? (
            <EmptyState message="Nenhuma dose futura registrada." />
          ) : (
            <View style={styles.doseList}>
              {upcomingDoses.map((dose) => (
                <DoseListItem key={dose.id} dose={dose} />
              ))}
            </View>
          )}
        </View>

        <AiCarePlanCard onPress={() => navigation.navigate('Cuidados')} />
      </ScrollView>
    </SafeAreaView>
  );
}
