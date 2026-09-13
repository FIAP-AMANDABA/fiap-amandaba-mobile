import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Pet } from '../interfaces/pet';
import { formatEnumLabel } from '../services/formatUtils';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface PetCardProps {
  pet: Pet;
  onPress?: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const details = [formatEnumLabel(pet.especie), pet.raca, pet.sexo && formatEnumLabel(pet.sexo)]
    .filter(Boolean)
    .join(' · ');

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.photo}>
        {pet.fotoUrl ? (
          <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={28} color={colors.gray} />
        )}
      </View>
      <Text style={styles.name}>{pet.nome.toUpperCase()}</Text>
      {details ? <Text style={styles.details}>{details}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
  },
  photo: {
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
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
    color: colors.black,
  },
  details: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
  },
});
