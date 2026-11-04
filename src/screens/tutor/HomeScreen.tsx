import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InicioStackParamList, TutorTabParamList } from '../../interfaces/navigation';
import { useHomeData } from '../../hooks/useHomeData';
import { useTodayReminderCount } from '../../hooks/useReminders';
import { useRelatorio } from '../../hooks/useRelatorio';
import { PetHealthSummary } from '../../components/PetHealthSummary';
import { NotificationBell } from '../../components/NotificationBell';
import { StatCard } from '../../components/StatCard';
import { CicloSemanaCard } from '../../components/CicloSemanaCard';
import { SectionHeader } from '../../components/SectionHeader';
import { PetCard } from '../../components/PetCard';
import { DoseListItem } from '../../components/DoseListItem';
import { AiCarePlanCard } from '../../components/AiCarePlanCard';
import { EmptyState } from '../../components/EmptyState';
import { ScreenLoading } from '../../components/ScreenLoading';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { createHomeStyles } from '../../styles/tutor/home.styles';

type Props = CompositeScreenProps<
  NativeStackScreenProps<InicioStackParamList, 'Home'>,
  BottomTabScreenProps<TutorTabParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const styles = useThemedStyles(createHomeStyles);
  const { tutor, pets, petsAtivos, upcomingDoses, cicloItems, ciclosAtrasados, isLoading, errorMessage } =
    useHomeData();
  const remindersToday = useTodayReminderCount();
  const { data: relatorio = [] } = useRelatorio();

  if (isLoading) return <ScreenLoading />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={styles.tutorLabel}>TUTOR · {tutor?.nome ?? '—'}</Text>
            <Text style={styles.title}>MEUS PETS</Text>
          </View>
          <NotificationBell count={remindersToday} onPress={() => navigation.navigate('Lembretes')} />
        </View>

        {errorMessage && <EmptyState message={errorMessage} />}

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
                  <PetCard
                    key={pet.idPet}
                    pet={pet}
                    onPress={() =>
                      navigation.navigate('Pets', { screen: 'PetDetail', params: { petId: pet.idPet } })
                    }
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {relatorio.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="SAÚDE DOS PETS" />
            <View style={styles.doseList}>
              {relatorio.map((item) => (
                <View key={item.idPet} style={styles.healthCard}>
                  <Text style={styles.healthName}>{item.nomePet.toUpperCase()}</Text>
                  <PetHealthSummary item={item} />
                </View>
              ))}
            </View>
          </View>
        )}

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
