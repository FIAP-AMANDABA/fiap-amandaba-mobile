import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from '../../../interfaces/navigation';
import { buildProfileSubmission, type ProfileFormFields } from '../../../domain/profileInputs';
import { useCurrentProfile } from '../../../hooks/useProfile';
import { useUpdateProfile } from '../../../hooks/useProfileMutations';
import { getErrorMessage } from '../../../services/http';
import { formatCpf, formatPhone } from '../../../utils/formatUtils';
import { formatDateBr } from '../../../utils/dateUtils';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { FormInput } from '../../../components/FormInput';
import { GradientButton } from '../../../components/GradientButton';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { InfoHint } from '../../../components/InfoHint';
import { EmptyState } from '../../../components/EmptyState';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../styles/tutor/petForm.styles';

type Props = NativeStackScreenProps<PerfilStackParamList, 'EditarPerfil'>;

const EMPTY_FIELDS: ProfileFormFields = { nomeCompleto: '', email: '', telefone: '', dataNascimento: '' };

export default function EditarPerfilScreen({ navigation }: Props) {
  const styles = useThemedStyles(createPetFormStyles);
  const { data: profile, isLoading } = useCurrentProfile();
  const updateProfile = useUpdateProfile();
  const isVet = profile?.role === 'VETERINARIO';

  const [fields, setFields] = useState<ProfileFormFields>(EMPTY_FIELDS);
  const [crmv, setCrmv] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const setField = <K extends keyof ProfileFormFields>(key: K, value: ProfileFormFields[K]) =>
    setFields((current) => ({ ...current, [key]: value }));

  const prefilled = useRef(false);
  useEffect(() => {
    if (!profile || prefilled.current) return;
    prefilled.current = true;

    setFields({
      nomeCompleto: profile.nome,
      email: profile.email,
      telefone: profile.telefone ? formatPhone(profile.telefone) : '',
      dataNascimento: profile.dataNascimento ? formatDateBr(profile.dataNascimento) : '',
    });
    setCrmv(profile.crmv ?? '');
  }, [profile]);

  const buildUpdate = () =>
    buildProfileSubmission(fields, { isVet, crmv, currentCrmv: profile?.crmv ?? null });

  const handleSubmit = () => {
    setValidationError(null);
    updateProfile.reset();

    const result = buildUpdate();
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const result = buildUpdate();
    if (!result.ok) return;

    try {
      await updateProfile.mutateAsync(result.input);
      setShowConfirm(false);
      navigation.goBack();
    } catch {
      setShowConfirm(false);
    }
  };

  if (isLoading) return <ScreenLoading />;

  if (!profile) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader title="EDITAR PERFIL" onBack={() => navigation.goBack()} />
          <EmptyState message="Não foi possível carregar o seu perfil." />
        </View>
      </SafeAreaView>
    );
  }

  const errorMessage =
    validationError ??
    (updateProfile.error ? getErrorMessage(updateProfile.error, 'Não foi possível salvar as alterações.') : null);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="EDITAR PERFIL" onBack={() => navigation.goBack()} />

        <FormInput
          placeholder="NOME COMPLETO *"
          value={fields.nomeCompleto}
          onChangeText={(value) => setField('nomeCompleto', value)}
          maxLength={150}
        />
        <FormInput
          placeholder="TELEFONE *  ·  com DDD"
          value={fields.telefone}
          onChangeText={(value) => setField('telefone', value)}
          keyboardType="phone-pad"
          maxLength={15}
        />
        <FormInput
          placeholder="DATA DE NASCIMENTO *  ·  dd/mm/aaaa"
          value={fields.dataNascimento}
          onChangeText={(value) => setField('dataNascimento', value)}
          keyboardType="numeric"
          maxLength={10}
        />
        {isVet && (
          <FormInput
            placeholder="CRMV *"
            value={crmv}
            onChangeText={setCrmv}
            autoCapitalize="characters"
            maxLength={20}
          />
        )}

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>NÃO EDITÁVEIS</Text>
            <InfoHint
              title="Campos não editáveis"
              text="O CPF e o e-mail identificam a conta e não podem ser alterados."
            />
          </View>
          <FormInput placeholder="CPF" value={formatCpf(profile.cpf)} editable={false} style={styles.lockedInput} />
          <FormInput placeholder="E-MAIL" value={profile.email} editable={false} style={styles.lockedInput} />
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={updateProfile.isPending ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            onPress={updateProfile.isPending ? undefined : handleSubmit}
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        title="Salvar alterações"
        message="Tem certeza que deseja atualizar seus dados de perfil?"
        confirmLabel={updateProfile.isPending ? 'SALVANDO...' : 'SALVAR'}
        destructive={false}
        onCancel={() => setShowConfirm(false)}
        onConfirm={updateProfile.isPending ? () => undefined : handleConfirm}
      />
    </SafeAreaView>
  );
}
