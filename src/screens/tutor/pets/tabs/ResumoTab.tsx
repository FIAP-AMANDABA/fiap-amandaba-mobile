import React from 'react';
import { View, Text } from 'react-native';
import type { Pet } from '../../../../interfaces/pet';
import { InfoRow } from '../../../../components/InfoRow';
import { formatDateBr } from '../../../../services/dateUtils';
import { formatEnumLabel } from '../../../../services/formatUtils';
import { petDetailStyles as styles } from '../../../../styles/tutor/petDetail.styles';

interface ResumoTabProps {
  pet: Pet;
}

export function ResumoTab({ pet }: ResumoTabProps) {
  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CADASTRO</Text>
        <View style={styles.card}>
          <InfoRow label="Espécie" value={formatEnumLabel(pet.especie)} />
          <InfoRow label="Raça" value={pet.raca ?? '—'} />
          <InfoRow label="Sexo" value={pet.sexo ? formatEnumLabel(pet.sexo) : '—'} />
          <InfoRow label="Nascimento" value={formatDateBr(pet.dataNascimento)} />
          <InfoRow label="Cor" value={pet.cor ?? '—'} />
          <InfoRow label="Castrado" value={pet.castrado ? 'Sim' : 'Não'} />
          <InfoRow label="Microchip" value={pet.microchip ?? '—'} />
          <InfoRow label="Cadastrado em" value={formatDateBr(pet.dataCadastro)} />
        </View>
      </View>
    </View>
  );
}
