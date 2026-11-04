import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import { useMyPetsSearch, usePesosAtuais, useUpdatePetStatus } from '../../../hooks/usePets';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { getErrorMessage } from '../../../services/http';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { PetListItem } from '../../../components/PetListItem';
import { GradientButton } from '../../../components/GradientButton';
import { FormInput } from '../../../components/FormInput';
import { EmptyState } from '../../../components/EmptyState';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPetsListStyles } from '../../../styles/tutor/petsList.styles';

type Props = NativeStackScreenProps<PetsStackParamList, 'PetsList'>;

export default function PetsListScreen({ navigation }: Props) {
  const styles = useThemedStyles(createPetsListStyles);
  const [search, setSearch] = useState('');
  const nome = useDebouncedValue(search);
  const { pets, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyPetsSearch(nome);
  const pesos = usePesosAtuais(pets);
  const updateStatus = useUpdatePetStatus();

  // O carregamento de tela cheia só vale para a primeira abertura; ao buscar, a lista se atualiza no lugar.
  if (isLoading && !nome && pets.length === 0) return <ScreenLoading />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="PETS" />

        <FormInput
          placeholder="BUSCAR PET PELO NOME"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {error && <EmptyState message={getErrorMessage(error, 'Erro ao carregar pets.')} />}
        {updateStatus.error && (
          <EmptyState message={getErrorMessage(updateStatus.error, 'Não foi possível alterar o status do pet.')} />
        )}

        {pets.length === 0 ? (
          <EmptyState message={nome ? 'Nenhum pet encontrado com esse nome.' : 'Nenhum pet cadastrado ainda.'} />
        ) : (
          <View style={styles.list}>
            {pets.map((pet) => (
              <PetListItem
                key={pet.idPet}
                pet={pet}
                pesoAtual={pesos[pet.idPet]}
                onPress={() => navigation.navigate('PetDetail', { petId: pet.idPet })}
                onToggleStatus={() =>
                  updateStatus.mutate({
                    petId: pet.idPet,
                    status: pet.status === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                  })
                }
              />
            ))}
          </View>
        )}

        {hasNextPage && (
          <GradientButton
            label={isFetchingNextPage ? 'CARREGANDO...' : 'CARREGAR MAIS'}
            onPress={isFetchingNextPage ? undefined : () => void fetchNextPage()}
          />
        )}

        <GradientButton label="CADASTRAR PET" onPress={() => navigation.navigate('PetForm')} />
      </ScrollView>
    </SafeAreaView>
  );
}
