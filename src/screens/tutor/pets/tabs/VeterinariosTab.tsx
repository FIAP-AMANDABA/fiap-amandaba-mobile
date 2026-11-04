import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { usePetVeterinarios, useRevokeShare, useSharePet, useVeterinarioSearch } from '../../../../hooks/useVeterinarios';
import { isShareActive } from '../../../../domain/compartilhamento';
import { getErrorMessage } from '../../../../services/http';
import type { VeterinarioSearchField } from '../../../../services/veterinarioService';
import { formatDateBr } from '../../../../utils/dateUtils';
import { RecordCard } from '../../../../components/RecordCard';
import { EmptyState } from '../../../../components/EmptyState';
import { FormModal } from '../../../../components/FormModal';
import { FormInput } from '../../../../components/FormInput';
import { GradientButton } from '../../../../components/GradientButton';
import { PillSelector } from '../../../../components/PillSelector';
import { SectionAddHeader } from '../../../../components/SectionAddHeader';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { useThemedStyles } from '../../../../theme/useThemedStyles';
import { createPetDetailStyles } from '../../../../styles/tutor/petDetail.styles';
import { createVeterinariosStyles } from '../../../../styles/tutor/veterinarios.styles';

const SEARCH_FIELDS = [
  { label: 'NOME', value: 'nome' },
  { label: 'CRMV', value: 'crmv' },
];

interface VeterinariosTabProps {
  petId: number;
}

export function VeterinariosTab({ petId }: VeterinariosTabProps) {
  const styles = useThemedStyles(createPetDetailStyles);
  const vetStyles = useThemedStyles(createVeterinariosStyles);

  const { items, isLoading, error } = usePetVeterinarios(petId);
  const sharePet = useSharePet(petId);
  const revokeShare = useRevokeShare(petId);

  const [showSearch, setShowSearch] = useState(false);
  const [searchField, setSearchField] = useState<VeterinarioSearchField>('nome');
  const [textInput, setTextInput] = useState('');
  const [searchedText, setSearchedText] = useState('');
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const search = useVeterinarioSearch(searchField, searchedText, petId);

  const openSearch = () => {
    sharePet.reset();
    setSearchField('nome');
    setTextInput('');
    setSearchedText('');
    setShowSearch(true);
  };

  const handleShare = async (veterinarioId: number) => {
    try {
      await sharePet.mutateAsync(veterinarioId);
      setShowSearch(false);
    } catch {
      // a mensagem fica em sharePet.error
    }
  };

  const handleRevoke = async () => {
    if (revokingId === null) return;
    try {
      await revokeShare.mutateAsync(revokingId);
      setRevokingId(null);
    } catch {
      // a mensagem aparece no modal (revokeShare.error)
    }
  };

  const revokingVet = items.find((item) => item.share.idVeterinario === revokingId)?.veterinario;

  return (
    <View style={styles.section}>
      <SectionAddHeader
        title="VETERINÁRIOS COM ACESSO"
        addLabel="+ COMPARTILHAR"
        onAdd={openSearch}
        info={{
          title: 'Veterinários com acesso',
          text: 'Veterinários com acesso podem consultar este pet e registrar informações de saúde. Só você pode editar o cadastro do pet. Você pode revogar o acesso quando quiser.',
        }}
      />

      {error && <EmptyState message={getErrorMessage(error, 'Erro ao carregar os veterinários.')} />}

      {!isLoading &&
        !error &&
        (items.length === 0 ? (
          <EmptyState message="Este pet ainda não foi compartilhado com nenhum veterinário." />
        ) : (
          items.map(({ share, veterinario }) => (
            <View key={share.idVeterinario} style={vetStyles.shareBlock}>
              <RecordCard
                title={veterinario?.nomeCompleto ?? `Veterinário #${share.idVeterinario}`}
                badge={share.status}
                lines={[veterinario ? veterinario.crmv : '', `Compartilhado em ${formatDateBr(share.dataCompartilhamento)}`].filter(
                  Boolean
                )}
              />
              {isShareActive(share) && (
                <TouchableOpacity
                  style={vetStyles.revokeButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    revokeShare.reset();
                    setRevokingId(share.idVeterinario);
                  }}
                >
                  <Text style={vetStyles.revokeLabel}>REVOGAR ACESSO</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ))}

      <FormModal visible={showSearch} title="Compartilhar com veterinário" onClose={() => setShowSearch(false)}>
        <Text style={vetStyles.hint}>Buscar por</Text>
        <PillSelector
          options={SEARCH_FIELDS}
          value={searchField}
          onChange={(value) => {
            setSearchField(value as VeterinarioSearchField);
            setTextInput('');
            setSearchedText('');
          }}
        />
        <FormInput
          placeholder={searchField === 'crmv' ? 'CRMV DO VETERINÁRIO  ·  ex. CRMV-SP 12345' : 'NOME DO VETERINÁRIO'}
          value={textInput}
          onChangeText={setTextInput}
          autoCapitalize={searchField === 'crmv' ? 'characters' : 'words'}
          returnKeyType="search"
          onSubmitEditing={() => setSearchedText(textInput)}
        />
        <GradientButton label="BUSCAR" onPress={() => setSearchedText(textInput)} />

        {sharePet.error && (
          <Text style={vetStyles.errorText}>{getErrorMessage(sharePet.error, 'Não foi possível compartilhar.')}</Text>
        )}
        {search.error && (
          <Text style={vetStyles.errorText}>{getErrorMessage(search.error, 'Erro ao buscar veterinários.')}</Text>
        )}

        {search.isLoading && <Text style={vetStyles.hint}>Buscando...</Text>}

        {!search.isLoading && !search.error && search.results.length === 0 && (
          <EmptyState message="Nenhum veterinário encontrado." />
        )}

        {search.results.map((vet) => (
          <View key={vet.idVeterinario} style={vetStyles.resultRow}>
            <View style={vetStyles.resultInfo}>
              <Text style={vetStyles.resultName}>{vet.nomeCompleto.toUpperCase()}</Text>
              <Text style={vetStyles.resultCrmv}>{vet.crmv}</Text>
            </View>
            <TouchableOpacity
              style={vetStyles.shareButton}
              activeOpacity={0.8}
              onPress={sharePet.isPending ? undefined : () => handleShare(vet.idVeterinario)}
            >
              <Text style={vetStyles.shareLabel}>{sharePet.isPending ? '...' : 'COMPARTILHAR'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </FormModal>

      <ConfirmModal
        visible={revokingId !== null}
        title="Revogar acesso"
        message={`${revokingVet?.nomeCompleto ?? 'O veterinário'} deixará de ver este pet e de registrar informações de saúde. Você pode compartilhar de novo depois.`}
        confirmLabel={revokeShare.isPending ? 'REVOGANDO...' : 'REVOGAR'}
        errorMessage={revokeShare.error ? getErrorMessage(revokeShare.error, 'Não foi possível revogar o acesso.') : null}
        onCancel={() => setRevokingId(null)}
        onConfirm={revokeShare.isPending ? () => undefined : handleRevoke}
      />
    </View>
  );
}
