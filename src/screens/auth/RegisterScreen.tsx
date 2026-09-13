import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../interfaces/navigation';
import { FormInput } from '../../components/FormInput';
import { GradientButton } from '../../components/GradientButton';
import { registerStyles as styles } from '../../styles/auth/register.styles';
import { register } from '../../services/authService';
import { parseBrDate } from '../../services/dateUtils';

const heroImage = require('../../../assets/images/hero-register.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || cpf.length !== 11) {
      setError('Preencha nome, CPF (11 dígitos), e-mail e senha.');
      return;
    }

    const dataNascimento = parseBrDate(birthDate);
    if (birthDate && !dataNascimento) {
      setError('Data de nascimento inválida. Use dd/mm/aaaa.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        nomeCompleto: fullName.trim(),
        cpf,
        dataNascimento: dataNascimento ?? '',
        email: email.trim(),
        telefone: phone.trim(),
        password,
      });
      navigation.navigate('Login');
    } catch (err) {
      setError(
        err instanceof Error
          ? `Não foi possível concluir o cadastro (${err.message}).`
          : 'Não foi possível concluir o cadastro.'
      );
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

        <Text style={styles.title}>CRIAR CONTA</Text>

        <View style={styles.form}>
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
            placeholder="DATA DE NASCIMENTO:"
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
          <FormInput
            placeholder="SENHA:"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={submitting ? 'ENVIANDO...' : 'FINALIZAR CADASTRO'}
            onPress={submitting ? undefined : handleSubmit}
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
