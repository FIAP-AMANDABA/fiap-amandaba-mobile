import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from '../../../interfaces/navigation';
import { useAppInfo } from '../../../hooks/useAppInfo';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { InfoRow } from '../../../components/InfoRow';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createSobreStyles } from '../../../styles/tutor/sobre.styles';

type Props = NativeStackScreenProps<PerfilStackParamList, 'Sobre'>;

export default function SobreScreen({ navigation }: Props) {
  const styles = useThemedStyles(createSobreStyles);
  const info = useAppInfo();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="SOBRE O APP"
          onBack={() => navigation.goBack()}
          info={{
            title: 'Sobre o AmandaBa',
            text: 'Aplicativo para tutores e veterinários acompanharem a saúde dos pets: cadastro, histórico clínico, consultas, lembretes de vacinas, medicamentos e consultas, e plano de cuidados gerado por IA.',
          }}
        />

        <View style={styles.card}>
          <InfoRow label="Aplicativo" value={info.name} />
          <InfoRow label="Versão" value={info.version} />
          <InfoRow label="Commit" value={info.commitShort} />
          <Text style={styles.hashLabel}>Hash completo do commit</Text>
          <Text style={styles.hash} selectable>
            {info.commitHash}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
