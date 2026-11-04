import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Pet } from '../interfaces/pet';
import { formatEnumLabel } from '../utils/formatUtils';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  const details = [formatEnumLabel(pet.especie), pet.raca, pet.sexo && formatEnumLabel(pet.sexo)]
    .filter(Boolean)
    .join(' · ');

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.photo}>
        {pet.fotoUrl ? (
          <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={28} color={palette.textMuted} />
        )}
      </View>
      <Text style={styles.name}>{pet.nome.toUpperCase()}</Text>
      {details ? <Text style={styles.details}>{details}</Text> : null}
    </TouchableOpacity>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      width: 150,
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: spacing.sm,
    },
    photo: {
      height: 90,
      borderRadius: 8,
      backgroundColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    name: {
      ...typography.label,
      color: c.text,
    },
    details: {
      ...typography.bodySmall,
      color: c.textMuted,
      marginTop: 2,
    },
  });
