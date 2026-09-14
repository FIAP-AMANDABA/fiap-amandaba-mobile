import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import { usePetDetail } from './usePetDetail';
import { updatePetStatus } from '../../../services/petService';
import { StatusBadge } from '../../../components/StatusBadge';
import { SubTabBar } from '../../../components/SubTabBar';
import { EmptyState } from '../../../components/EmptyState';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ResumoTab } from './tabs/ResumoTab';
import { PesoTab } from './tabs/PesoTab';
import { VacinasTab } from './tabs/VacinasTab';
import { ClinicoTab } from './tabs/ClinicoTab';
import { ExamesTab } from './tabs/ExamesTab';
import { formatEnumLabel } from '../../../services/formatUtils';
import { petDetailStyles as styles } from '../../../styles/tutor/petDetail.styles';
import { colors } from '../../../styles/colors';

type TabKey = 'resumo' | 'peso' | 'vacinas' | 'clinico' | 'exames';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'resumo', label: 'RESUMO' },
  { key: 'peso', label: 'PESO' },
  { key: 'vacinas', label: 'VACINAS' },
  { key: 'clinico', label: 'CLÍNICO' },
  { key: 'exames', label: 'EXAMES' },
];

type Props = NativeStackScreenProps<PetsStackParamList, 'PetDetail'>;

export default function PetDetailScreen({ route, navigation }: Props) {
  const { petId } = route.params;
  const { pet, loading, error, reload } = usePetDetail(petId);
  const [activeTab, setActiveTab] = useState<TabKey>('resumo');

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeletePet = async () => {
    if (!pet) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await updatePetStatus(pet.idPet, 'INATIVO');
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao excluir pet.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !pet) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.container}>
          <EmptyState message={error ?? 'Pet não encontrado.'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color={colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.petHeader}>
          <View style={styles.photo}>
            {pet.fotoUrl ? (
              <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
            ) : (
              <Ionicons name="image-outline" size={26} color={colors.gray} />
            )}
          </View>
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.nome.toUpperCase()}</Text>
            <Text style={styles.petSubtitle}>
              {[formatEnumLabel(pet.especie), pet.raca].filter(Boolean).join(' · ')}
            </Text>
            <StatusBadge status={pet.status} />
          </View>
        </View>

        <SubTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {activeTab === 'resumo' && <ResumoTab pet={pet} />}
        {activeTab === 'peso' && <PesoTab petId={pet.idPet} />}
        {activeTab === 'vacinas' && <VacinasTab petId={pet.idPet} />}
        {activeTab === 'clinico' && <ClinicoTab petId={pet.idPet} />}
        {activeTab === 'exames' && <ExamesTab petId={pet.idPet} />}

        {activeTab === 'resumo' && (
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
                setDeleteError(null);
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
        confirmLabel={deleting ? 'EXCLUINDO...' : 'EXCLUIR'}
        errorMessage={deleteError}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePet}
      />
    </SafeAreaView>
  );
}
