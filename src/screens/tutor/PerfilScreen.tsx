import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TutorTabParamList } from '../../interfaces/navigation';
import { usePerfil } from './usePerfil';
import { InfoRow } from '../../components/InfoRow';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmModal } from '../../components/ConfirmModal';
import { formatCpf, formatPhone } from '../../services/formatUtils';
import { formatDateBr } from '../../services/dateUtils';
import { perfilStyles as styles } from '../../styles/tutor/perfil.styles';
import { colors } from '../../styles/colors';

type Mode = 'TUTOR' | 'VETERINARIO';

type Props = BottomTabScreenProps<TutorTabParamList, 'Perfil'>;

export default function PerfilScreen({ navigation }: Props) {
  const { tutor, loading } = usePerfil();
  const [mode, setMode] = useState<Mode>('TUTOR');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogout = () => {
    navigation.getParent()?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Welcome' }] })
    );
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

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PERFIL</Text>

        {!tutor ? (
          <EmptyState message="Não foi possível identificar o tutor logado." />
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.profileRow}>
                <View style={styles.photo}>
                  <Ionicons name="person-outline" size={26} color={colors.gray} />
                </View>
                <View>
                  <Text style={styles.name}>{tutor.nome.toUpperCase()}</Text>
                  <Text style={styles.subtitle}>
                    Tutor #{tutor.idTutor} · usuário #{tutor.idUsuario}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View>
                <InfoRow label="CPF" value={formatCpf(tutor.cpf)} labelColor={colors.roseMuted} />
                <InfoRow label="E-mail" value={tutor.email} labelColor={colors.roseMuted} />
                <InfoRow
                  label="Telefone"
                  value={tutor.telefone ? formatPhone(tutor.telefone) : '—'}
                  labelColor={colors.roseMuted}
                />
                <InfoRow
                  label="Nascimento"
                  value={formatDateBr(tutor.dataNascimento)}
                  labelColor={colors.roseMuted}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MODO DE USO</Text>
              <View style={styles.rolesRow}>
                <TouchableOpacity
                  style={[styles.roleCard, mode === 'TUTOR' && styles.roleCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setMode('TUTOR')}
                >
                  <Text style={[styles.roleTitle, mode === 'TUTOR' && styles.roleTitleSelected]}>TUTOR</Text>
                  <Text style={styles.roleSubtitle}>cuido dos meus pets</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleCard, mode === 'VETERINARIO' && styles.roleCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setMode('VETERINARIO')}
                >
                  <Text style={[styles.roleTitle, mode === 'VETERINARIO' && styles.roleTitleSelected]}>
                    VETERINÁRIO
                  </Text>
                  <Text style={styles.roleSubtitle}>atendo pacientes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutLabel}>SAIR DA CONTA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setDeleteError(null);
            setShowDeleteConfirm(true);
          }}
        >
          <Text style={styles.deleteAccountLabel}>EXCLUIR CONTA</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
        confirmLabel="EXCLUIR"
        errorMessage={deleteError}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() =>
          setDeleteError(
            'A exclusão de conta ainda não é suportada pela API — peça para o time do Java criar um endpoint para isso.'
          )
        }
      />
    </SafeAreaView>
  );
}
