import { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../interfaces/navigation';
import { FormInput } from '../../components/FormInput';
import { GradientButton } from '../../components/GradientButton';
import { buildLoginRequest } from '../../domain/authInputs';
import { homeRouteFor } from '../../navigation/homeRoute';
import { useLogin } from '../../hooks/useAuthMutations';
import { useThemedStyles } from '../../theme/useThemedStyles';
import { createLoginStyles } from '../../styles/auth/login.styles';

const heroImage = require('../../../assets/images/hero-login.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const styles = useThemedStyles(createLoginStyles);
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    const request = buildLoginRequest(email, password);
    if (!request.ok) {
      setValidationError(request.error);
      return;
    }

    try {
      const session = await loginMutation.mutateAsync(request.input);
      navigation.reset({ index: 0, routes: [{ name: homeRouteFor(session.role) }] });
    } catch {
      // a mensagem fica em loginMutation.error
    }
  };

  const errorMessage = validationError ?? loginMutation.error?.message ?? null;

  return (
    <SafeAreaView style={styles.scroll} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>ENTRAR</Text>

        {route.params?.expired && (
          <Text style={styles.noticeText}>Sua sessão expirou. Entre novamente para continuar.</Text>
        )}

        <View style={styles.form}>
          <FormInput
            placeholder="EMAIL:"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
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
            label={loginMutation.isPending ? 'ENTRANDO...' : 'ENTRAR'}
            onPress={loginMutation.isPending ? undefined : handleSubmit}
          />
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>NÃO POSSUI LOGIN? </Text>
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            CADASTRO
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
