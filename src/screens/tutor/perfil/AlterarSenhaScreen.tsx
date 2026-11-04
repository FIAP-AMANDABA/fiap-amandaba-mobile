import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from '../../../interfaces/navigation';
import { buildPasswordChange, type PasswordChangeFields } from '../../../domain/authInputs';
import { useChangePassword } from '../../../hooks/useProfileMutations';
import { getErrorMessage } from '../../../services/http';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { FormInput } from '../../../components/FormInput';
import { GradientButton } from '../../../components/GradientButton';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../styles/tutor/petForm.styles';

type Props = NativeStackScreenProps<PerfilStackParamList, 'AlterarSenha'>;

const EMPTY_FIELDS: PasswordChangeFields = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function AlterarSenhaScreen({ navigation }: Props) {
  const styles = useThemedStyles(createPetFormStyles);
  const changePassword = useChangePassword();

  const [fields, setFields] = useState<PasswordChangeFields>(EMPTY_FIELDS);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const setField = <K extends keyof PasswordChangeFields>(key: K, value: PasswordChangeFields[K]) =>
    setFields((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    setValidationError(null);
    setDone(false);

    const result = buildPasswordChange(fields);
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    try {
      await changePassword.mutateAsync(result.input);
      setFields(EMPTY_FIELDS);
      setDone(true);
    } catch {
      // a mensagem fica em changePassword.error
    }
  };

  const errorMessage =
    validationError ??
    (changePassword.error ? getErrorMessage(changePassword.error, changePassword.error.message) : null);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="ALTERAR SENHA" onBack={() => navigation.goBack()} />

        <FormInput
          placeholder="SENHA ATUAL *"
          value={fields.currentPassword}
          onChangeText={(value) => setField('currentPassword', value)}
          secureTextEntry
          autoCapitalize="none"
        />
        <FormInput
          placeholder="NOVA SENHA *  ·  mínimo de 8 caracteres"
          value={fields.newPassword}
          onChangeText={(value) => setField('newPassword', value)}
          secureTextEntry
          autoCapitalize="none"
        />
        <FormInput
          placeholder="CONFIRMAR NOVA SENHA *"
          value={fields.confirmPassword}
          onChangeText={(value) => setField('confirmPassword', value)}
          secureTextEntry
          autoCapitalize="none"
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {done && <Text style={styles.hintText}>Senha alterada com sucesso.</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={changePassword.isPending ? 'SALVANDO...' : 'ALTERAR SENHA'}
            onPress={changePassword.isPending ? undefined : handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
