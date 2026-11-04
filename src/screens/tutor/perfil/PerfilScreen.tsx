import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from '../../../interfaces/navigation';
import { useCurrentProfile } from '../../../hooks/useProfile';
import { useLogout } from '../../../hooks/useAuthMutations';
import { useDeleteAccount } from '../../../hooks/useProfileMutations';
import { getErrorMessage } from '../../../services/http';
import { InfoRow } from '../../../components/InfoRow';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { EmptyState } from '../../../components/EmptyState';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { ThemeModeSelector } from '../../../components/ThemeModeSelector';
import { formatCpf, formatPhone } from '../../../utils/formatUtils';
import { formatDateBr } from '../../../utils/dateUtils';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPerfilStyles } from '../../../styles/tutor/perfil.styles';

type Props = NativeStackScreenProps<PerfilStackParamList, 'PerfilHome'>;

export default function PerfilScreen({ navigation }: Props) {
  const styles = useThemedStyles(createPerfilStyles);
  const { palette } = useTheme();
  const { data: profile, isLoading } = useCurrentProfile();
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) return <ScreenLoading />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PERFIL</Text>

        {!profile ? (
          <EmptyState message="Não foi possível carregar o seu perfil." />
        ) : (
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.photo}>
                <Ionicons name="person-outline" size={26} color={palette.textMuted} />
              </View>
              <View>
                <Text style={styles.name}>{profile.nome.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View>
              <InfoRow label="CPF" value={formatCpf(profile.cpf)} tinted />
              <InfoRow label="E-mail" value={profile.email} tinted />
              <InfoRow label="Telefone" value={profile.telefone ? formatPhone(profile.telefone) : '—'} tinted />
              <InfoRow label="Nascimento" value={formatDateBr(profile.dataNascimento)} tinted />
              {profile.crmv && <InfoRow label="CRMV" value={profile.crmv} tinted />}
            </View>
          </View>
        )}

        {profile && (
          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Text style={styles.outlineButtonLabel}>EDITAR PERFIL</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APARÊNCIA</Text>
          <ThemeModeSelector />
        </View>

        <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={() => navigation.navigate('AlterarSenha')}>
          <Text style={styles.menuLabel}>ALTERAR SENHA</Text>
          <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} activeOpacity={0.8} onPress={() => navigation.navigate('Sobre')}>
          <Text style={styles.menuLabel}>SOBRE O APP</Text>
          <Ionicons name="chevron-forward" size={18} color={palette.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={() => void logout()}>
          <Text style={styles.logoutLabel}>SAIR DA CONTA</Text>
        </TouchableOpacity>

        {profile && (
          <TouchableOpacity
            style={styles.deleteLink}
            activeOpacity={0.7}
            onPress={() => {
              deleteAccount.reset();
              setShowDeleteConfirm(true);
            }}
          >
            <Text style={styles.deleteLinkLabel}>Excluir minha conta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Ela será desativada e você não poderá mais entrar com este e-mail."
        confirmLabel={deleteAccount.isPending ? 'EXCLUINDO...' : 'EXCLUIR CONTA'}
        errorMessage={
          deleteAccount.error ? getErrorMessage(deleteAccount.error, deleteAccount.error.message) : null
        }
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={deleteAccount.isPending ? () => undefined : () => deleteAccount.mutate()}
      />
    </SafeAreaView>
  );
}
