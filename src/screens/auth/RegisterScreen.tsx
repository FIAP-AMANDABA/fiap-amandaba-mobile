import { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../interfaces/navigation';
import { FormInput } from '../../components/FormInput';
import { GradientButton } from '../../components/GradientButton';
import { PillSelector } from '../../components/PillSelector';
import type { RegisterVetRequest, UserRole } from '../../interfaces/auth';
import { buildRegisterRequest, buildRegisterVetRequest } from '../../domain/authInputs';
import { useRegister } from '../../hooks/useAuthMutations';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { createRegisterStyles } from '../../styles/auth/register.styles';

const heroImage = require('../../../assets/images/hero-register.png');

const ROLE_OPTIONS = [
  { label: 'TUTOR', value: 'TUTOR' },
  { label: 'VETERINÁRIO', value: 'VETERINARIO' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const styles = useThemedStyles(createRegisterStyles);
  const registerMutation = useRegister();

  const [role, setRole] = useState<UserRole>('TUTOR');
  const [crmv, setCrmv] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    const fields = { fullName, cpf, birthDate, email, phone, password };
    const request =
      role === 'VETERINARIO'
        ? buildRegisterVetRequest(fields, crmv)
        : buildRegisterRequest(fields);
    if (!request.ok) {
      setValidationError(request.error);
      return;
    }

    try {
      await registerMutation.mutateAsync(
        role === 'VETERINARIO'
          ? { role, data: request.input as RegisterVetRequest }
          : { role, data: request.input }
      );
      navigation.navigate('Login');
    } catch {
      // a mensagem fica em registerMutation.error
    }
  };

  const errorMessage = validationError ?? registerMutation.error?.message ?? null;

  return (
    <SafeAreaView style={styles.scroll} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>CRIAR CONTA</Text>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EU SOU</Text>
            <PillSelector
              options={ROLE_OPTIONS}
              value={role}
              onChange={(value) => setRole(value as UserRole)}
            />
          </View>
          <FormInput
            placeholder="NOME COMPLETO:"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <FormInput
            placeholder="CPF:"
            value={cpf}
            onChangeText={(text) => setCpf(text.replace(/\D/g, ''))}
            keyboardType="numeric"
            maxLength={11}
          />
          <FormInput
            placeholder="DATA DE NASCIMENTO:  ·  dd/mm/aaaa"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numeric"
            maxLength={10}
          />
          <FormInput
            placeholder="E-MAIL:"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            placeholder="TELEFONE:"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {role === 'VETERINARIO' && (
            <FormInput
              placeholder="CRMV:  ·  ex. CRMV-SP 12345"
              value={crmv}
              onChangeText={setCrmv}
              autoCapitalize="characters"
              maxLength={20}
            />
          )}
          <FormInput
            placeholder="SENHA:"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={registerMutation.isPending ? 'ENVIANDO...' : 'FINALIZAR CADASTRO'}
            onPress={registerMutation.isPending ? undefined : handleSubmit}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>POSSUI CONTA? </Text>
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            ENTRAR
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
