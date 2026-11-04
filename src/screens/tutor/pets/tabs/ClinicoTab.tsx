import { View } from 'react-native';
import { DoencasSection } from './clinico/DoencasSection';
import { AlergiasSection } from './clinico/AlergiasSection';
import { MedicamentosSection } from './clinico/MedicamentosSection';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';

export function ClinicoTab({ petId }: { petId: number }) {
  const styles = useThemedStyles(createPetDetailStyles);

  return (
    <View style={styles.tabContent}>
      <DoencasSection petId={petId} />
      <AlergiasSection petId={petId} />
      <MedicamentosSection petId={petId} />
    </View>
  );
}
