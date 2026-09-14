import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../interfaces/navigation';
import { FormInput } from '../../components/FormInput';
import { GradientButton } from '../../components/GradientButton';
import { loginStyles as styles } from '../../styles/auth/login.styles';
import { login } from '../../services/authService';

const heroImage = require('../../../assets/images/hero-login.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigation.reset({ index: 0, routes: [{ name: 'TutorRoot' }] });
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.scroll} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        <Text style={styles.title}>ENTRAR</Text>

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

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.submitButton}>
          <GradientButton label={submitting ? 'ENTRANDO...' : 'ENTRAR'} onPress={submitting ? undefined : handleSubmit} />
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
