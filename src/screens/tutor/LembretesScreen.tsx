import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InicioStackParamList } from '../../interfaces/navigation';
import type { ReminderData } from '../../interfaces/reminder';
import {
  useEnableReminders,
  useReminderHistory,
  useReminderStatus,
  useUpcomingReminders,
} from '../../hooks/useReminders';
import { openPetFromReminder } from '../../navigation/navigationRef';
import { formatDateTimeBr } from '../../utils/dateUtils';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ReminderStatusCard } from '../../components/ReminderStatusCard';
import { RecordCard } from '../../components/RecordCard';
import { EmptyState } from '../../components/EmptyState';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { createLembretesStyles } from '../../styles/tutor/lembretes.styles';

type Props = NativeStackScreenProps<InicioStackParamList, 'Lembretes'>;

export default function LembretesScreen({ navigation }: Props) {
  const styles = useThemedStyles(createLembretesStyles);

  const { data: status } = useReminderStatus();
  const { enable, openSystemSettings } = useEnableReminders();
  const { plans, isLoading } = useUpcomingReminders();
  const { data: history = [] } = useReminderHistory();

  const openPet = (data: ReminderData) => {
    openPetFromReminder(data);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="LEMBRETES"
          onBack={() => navigation.goBack()}
          info={{
            title: 'Como funcionam os lembretes',
            text: 'Você é avisado antes da próxima dose de cada vacina, nos horários dos medicamentos em uso e antes das consultas agendadas. Os avisos chegam como notificação no celular (Android ou iOS); na versão web eles só são listados aqui. "Enviados recentemente" guarda os lembretes que já passaram da hora e só é registrado com as notificações ativadas. Tocar em um lembrete abre o pet.',
          }}
        />

        <ReminderStatusCard
          status={status}
          enabling={enable.isPending}
          onEnable={() => enable.mutate()}
          onOpenSettings={() => openSystemSettings()}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÓXIMOS</Text>
          {!isLoading && plans.length === 0 ? (
            <EmptyState message="Nenhum lembrete agendado." />
          ) : (
            plans.map((plan) => (
              <TouchableOpacity key={plan.id} activeOpacity={0.8} onPress={() => openPet(plan.data)}>
                <RecordCard
                  title={plan.title}
                  lines={[plan.body]}
                  footer={{ left: formatDateTimeBr(plan.fireAt.toISOString()) }}
                />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ENVIADOS RECENTEMENTE</Text>
          {history.length === 0 ? (
            <EmptyState message="Nenhum lembrete enviado ainda." />
          ) : (
            history.map((entry) => (
              <TouchableOpacity key={entry.id} activeOpacity={0.8} onPress={() => openPet(entry.data)}>
                <RecordCard
                  title={entry.title}
                  lines={[entry.body]}
                  footer={{ left: `Enviado em ${formatDateTimeBr(entry.at)}` }}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
