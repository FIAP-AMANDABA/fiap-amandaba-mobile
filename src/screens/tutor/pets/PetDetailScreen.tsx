import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import { usePet, usePetIdade, useUpdatePetStatus } from '../../../hooks/usePets';
import { getErrorMessage } from '../../../services/http';
import { StatusBadge } from '../../../components/StatusBadge';
import { SubTabBar } from '../../../components/SubTabBar';
import { EmptyState } from '../../../components/EmptyState';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { ResumoTab } from './tabs/ResumoTab';
import { PesoTab } from './tabs/PesoTab';
import { VacinasTab } from './tabs/VacinasTab';
import { ClinicoTab } from './tabs/ClinicoTab';
import { ExamesTab } from './tabs/ExamesTab';
import { ConsultasTab } from './tabs/ConsultasTab';
import { VeterinariosTab } from './tabs/VeterinariosTab';
import { useAuth } from '../../../providers/AuthProvider';
import { formatAge, formatEnumLabel } from '../../../utils/formatUtils';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../styles/tutor/petDetail.styles';

type TabKey = 'resumo' | 'peso' | 'vacinas' | 'consultas' | 'clinico' | 'exames' | 'veterinarios';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'resumo', label: 'RESUMO' },
  { key: 'peso', label: 'PESO' },
  { key: 'vacinas', label: 'VACINAS' },
  { key: 'consultas', label: 'CONSULTAS' },
  { key: 'clinico', label: 'CLÍNICO' },
  { key: 'exames', label: 'EXAMES' },
];

const TUTOR_TABS: { key: TabKey; label: string }[] = [...TABS, { key: 'veterinarios', label: 'VETERINÁRIOS' }];

type Props = NativeStackScreenProps<PetsStackParamList, 'PetDetail'>;

export default function PetDetailScreen({ route, navigation }: Props) {
  const { petId, initialTab } = route.params;
  const { role } = useAuth();
  const isTutor = role === 'TUTOR';
  const styles = useThemedStyles(createPetDetailStyles);
  const { palette } = useTheme();

  const { data: pet, isLoading, error } = usePet(petId);
  const updateStatus = useUpdatePetStatus();
  const { data: idadeAnos } = usePetIdade(petId);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab ?? 'resumo');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Vindo de uma notificação, a tela abre direto na aba do lembrete.
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab, petId]);

  const handleDeletePet = async () => {
    try {
      await updateStatus.mutateAsync({ petId, status: 'INATIVO' });
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch {
      // a mensagem fica em updateStatus.error
    }
  };

  if (isLoading) return <ScreenLoading />;

  if (error || !pet) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.container}>
          <EmptyState message={error ? getErrorMessage(error, 'Erro ao carregar pet.') : 'Pet não encontrado.'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={palette.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.petHeader}>
          <View style={styles.photo}>
            {pet.fotoUrl ? (
              <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
            ) : (
              <Ionicons name="image-outline" size={26} color={palette.textMuted} />
            )}
          </View>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.nome.toUpperCase()}</Text>
            <Text style={styles.petSubtitle}>
              {[formatEnumLabel(pet.especie), pet.raca, idadeAnos != null ? formatAge(idadeAnos) : null]
                .filter(Boolean)
                .join(' · ')}
            </Text>
            <StatusBadge status={pet.status} />
          </View>
        </View>

        <SubTabBar tabs={isTutor ? TUTOR_TABS : TABS} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'resumo' && <ResumoTab pet={pet} />}
        {activeTab === 'peso' && <PesoTab petId={pet.idPet} />}
        {activeTab === 'vacinas' && <VacinasTab petId={pet.idPet} />}
        {activeTab === 'consultas' && <ConsultasTab petId={pet.idPet} />}
        {activeTab === 'clinico' && <ClinicoTab petId={pet.idPet} />}
        {activeTab === 'exames' && <ExamesTab petId={pet.idPet} />}
        {activeTab === 'veterinarios' && isTutor && <VeterinariosTab petId={pet.idPet} />}

        {activeTab === 'resumo' && isTutor && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PetForm', { petId: pet.idPet })}
            >
              <Text style={styles.editButtonLabel}>EDITAR PET</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              onPress={() => {
                updateStatus.reset();
                setShowDeleteConfirm(true);
              }}
            >
              <Text style={styles.deleteButtonLabel}>EXCLUIR PET</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Excluir pet"
        message={`Tem certeza que deseja excluir ${pet.nome}? Como a API não permite remoção definitiva, o pet será marcado como inativo e some da sua lista de pets ativos.`}
        confirmLabel={updateStatus.isPending ? 'EXCLUINDO...' : 'EXCLUIR'}
        errorMessage={updateStatus.error ? getErrorMessage(updateStatus.error, 'Erro ao excluir pet.') : null}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePet}
      />
    </SafeAreaView>
  );
}
