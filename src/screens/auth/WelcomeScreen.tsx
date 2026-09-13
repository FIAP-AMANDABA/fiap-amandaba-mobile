import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../interfaces/navigation';
import { GradientButton } from '../../components/GradientButton';
import { welcomeStyles as styles } from '../../styles/auth/welcome.styles';

const heroImage = require('../../../assets/images/hero-onboarding.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.hero}>
        <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.heading}>
          ACOMPANHAMENTO CÍCLICO{'\n'}
          TOTALMENTE DISPONÍVEL{'\n'}
          PARA <Text style={styles.highlight}>TODOS</Text> OS PETS.
        </Text>
      </View>

      <View style={styles.footer}>
        <GradientButton label="CADASTRE-SE AGORA" onPress={() => navigation.navigate('Register')} />
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>POSSUI LOGIN? </Text>
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            ENTRAR
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
