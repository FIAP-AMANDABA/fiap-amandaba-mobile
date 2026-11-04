import { View, Text } from 'react-native';
import { GradientButton } from './GradientButton';
import { useThemedStyles } from '../theme/useThemedStyles';
import { createPetFormStyles } from '../styles/tutor/petForm.styles';

interface FormFooterProps {
  errorMessage: string | null;
  isPending: boolean;
  isEditing: boolean;
  createLabel: string;
  onSubmit: () => void;
}

export function FormFooter({ errorMessage, isPending, isEditing, createLabel, onSubmit }: FormFooterProps) {
  const styles = useThemedStyles(createPetFormStyles);

  return (
    <>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.submitButton}>
        <GradientButton
          label={isPending ? 'ENVIANDO...' : isEditing ? 'SALVAR ALTERAÇÕES' : createLabel}
          onPress={isPending ? undefined : onSubmit}
        />
      </View>
    </>
  );
}
