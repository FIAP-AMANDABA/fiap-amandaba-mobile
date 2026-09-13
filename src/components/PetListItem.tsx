import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Pet } from '../interfaces/pet';
import { StatusBadge } from './StatusBadge';
import { formatEnumLabel } from '../services/formatUtils';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface PetListItemProps {
  pet: Pet;
  pesoAtual?: number | null;
  onPress?: () => void;
  onToggleStatus?: () => void;
}

export function PetListItem({ pet, pesoAtual, onPress, onToggleStatus }: PetListItemProps) {
  const details = [formatEnumLabel(pet.especie), pet.raca, pet.sexo && formatEnumLabel(pet.sexo)]
    .filter(Boolean)
    .join(' · ');
  const isAtivo = pet.status === 'ATIVO';

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={onPress}>
        <View style={styles.photo}>
          {pet.fotoUrl ? (
            <Image source={{ uri: pet.fotoUrl }} style={styles.photoImage} resizeMode="cover" />
          ) : (
            <Ionicons name="image-outline" size={22} color={colors.gray} />
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.nome.toUpperCase()}</Text>
            <StatusBadge status={pet.status} />
          </View>
          {details ? <Text style={styles.details}>{details}</Text> : null}
          {pesoAtual != null && <Text style={styles.peso}>Peso atual {pesoAtual} kg</Text>}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.gray} />
      </TouchableOpacity>

      {onToggleStatus && (
        <TouchableOpacity style={styles.statusButton} activeOpacity={0.7} onPress={onToggleStatus}>
          <Text style={styles.statusButtonLabel}>{isAtivo ? 'INATIVAR' : 'ATIVAR'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.label,
    color: colors.black,
  },
  details: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  peso: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statusButtonLabel: {
    ...typography.bodySemiBold,
    fontSize: 11,
    color: colors.gray,
  },
});
