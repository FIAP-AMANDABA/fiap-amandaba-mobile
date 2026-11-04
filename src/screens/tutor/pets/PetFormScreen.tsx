import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../../../interfaces/navigation';
import { buildPetInput, type PetFormFields } from '../../../domain/recordInputs';
import { useCreatePet, useEspecies, usePet, useUpdatePet } from '../../../hooks/usePets';
import { getErrorMessage } from '../../../services/http';
import { formatDateBr } from '../../../utils/dateUtils';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { FormInput } from '../../../components/FormInput';
import { PillSelector } from '../../../components/PillSelector';
import { ToggleRow } from '../../../components/ToggleRow';
import { GradientButton } from '../../../components/GradientButton';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ScreenLoading } from '../../../components/ScreenLoading';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThemedStyles } from '../../../theme/useThemedStyles';
import { createPetFormStyles } from '../../../styles/tutor/petForm.styles';

// Valores no padrão da API (ex.: FEMEA).
const SEXO_OPTIONS = [
  { label: 'FÊMEA', value: 'FEMEA' },
  { label: 'MACHO', value: 'MACHO' },
];

const EMPTY_FIELDS: PetFormFields = {
  especie: null,
  nome: '',
  fotoUrl: '',
  raca: '',
  dataNascimento: '',
  cor: '',
  microchip: '',
  sexo: null,
  castrado: false,
};

type Props = NativeStackScreenProps<PetsStackParamList, 'PetForm'>;

export default function PetFormScreen({ navigation, route }: Props) {
  const petId = route.params?.petId;
  const isEditing = petId !== undefined;

  const styles = useThemedStyles(createPetFormStyles);
  const { palette } = useTheme();

  const { data: especies = [], isLoading: loadingEspecies, error: especiesError } = useEspecies();
  const { data: pet, isLoading: loadingPet } = usePet(petId);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet(petId ?? -1);

  const [fields, setFields] = useState<PetFormFields>(EMPTY_FIELDS);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const setField = <K extends keyof PetFormFields>(key: K, value: PetFormFields[K]) =>
    setFields((current) => ({ ...current, [key]: value }));

  const prefilled = useRef(false);
  useEffect(() => {
    if (!isEditing || !pet || prefilled.current) return;
    prefilled.current = true;

    setFields({
      especie: String(pet.idEspecie),
      nome: pet.nome,
      fotoUrl: pet.fotoUrl ?? '',
      raca: pet.raca ?? '',
      dataNascimento: pet.dataNascimento ? formatDateBr(pet.dataNascimento) : '',
      cor: pet.cor ?? '',
      microchip: pet.microchip ?? '',
      sexo: pet.sexo,
      castrado: pet.castrado,
    });
  }, [isEditing, pet]);

  const handleSubmit = async () => {
    setValidationError(null);

    const result = buildPetInput(fields);
    if (!result.ok) {
      setValidationError(result.error);
      return;
    }

    if (isEditing) {
      setShowConfirm(true);
      return;
    }

    try {
      await createPet.mutateAsync(result.input);
      navigation.goBack();
    } catch {
      // a mensagem fica em createPet.error
    }
  };

  const handleConfirmEdit = async () => {
    const result = buildPetInput(fields);
    if (!result.ok) return;

    try {
      await updatePet.mutateAsync(result.input);
      setShowConfirm(false);
      navigation.goBack();
    } catch {
      setShowConfirm(false);
    }
  };

  if (isEditing && loadingPet) return <ScreenLoading />;

  const submitting = createPet.isPending || updatePet.isPending;
  const mutationError = createPet.error ?? updatePet.error;
  const errorMessage =
    validationError ??
    (mutationError ? getErrorMessage(mutationError, mutationError.message) : null) ??
    (especiesError ? getErrorMessage(especiesError, 'Erro ao carregar espécies.') : null);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title={isEditing ? 'EDITAR PET' : 'CADASTRAR PET'} onBack={() => navigation.goBack()} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ESPÉCIE *</Text>
          {loadingEspecies ? (
            <ActivityIndicator color={palette.greenDark} />
          ) : (
            <PillSelector
              options={especies.map((especie) => ({
                label: especie.nome.toUpperCase(),
                value: String(especie.idEspecie),
              }))}
              value={fields.especie}
              onChange={(value) => setField('especie', value)}
            />
          )}
        </View>

        <FormInput
          placeholder="NOME DO PET *"
          value={fields.nome}
          onChangeText={(value) => setField('nome', value)}
          maxLength={100}
        />
        <FormInput
          placeholder="URL DA FOTO"
          value={fields.fotoUrl}
          onChangeText={(value) => setField('fotoUrl', value)}
          autoCapitalize="none"
          maxLength={500}
        />
        <FormInput
          placeholder="RAÇA"
          value={fields.raca}
          onChangeText={(value) => setField('raca', value)}
          maxLength={100}
        />
        <FormInput
          placeholder="DATA DE NASCIMENTO  ·  dd/mm/aaaa"
          value={fields.dataNascimento}
          onChangeText={(value) => setField('dataNascimento', value)}
          mask="date"
        />
        <FormInput
          placeholder="COR"
          value={fields.cor}
          onChangeText={(value) => setField('cor', value)}
          maxLength={50}
        />
        <FormInput
          placeholder="MICROCHIP"
          value={fields.microchip}
          onChangeText={(value) => setField('microchip', value)}
          maxLength={50}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SEXO</Text>
          <PillSelector options={SEXO_OPTIONS} value={fields.sexo} onChange={(value) => setField('sexo', value)} />
        </View>

        <ToggleRow label="CASTRADO" value={fields.castrado} onChange={(value) => setField('castrado', value)} />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.submitButton}>
          <GradientButton
            label={submitting ? 'ENVIANDO...' : isEditing ? 'SALVAR ALTERAÇÕES' : 'FINALIZAR CADASTRO'}
            onPress={submitting ? undefined : handleSubmit}
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        title="Salvar alterações"
        destructive={false}
        message={`Tem certeza que deseja salvar as alterações em ${fields.nome || 'este pet'}?`}
        confirmLabel={updatePet.isPending ? 'SALVANDO...' : 'SALVAR'}
        onCancel={() => setShowConfirm(false)}
        onConfirm={updatePet.isPending ? () => undefined : handleConfirmEdit}
      />
    </SafeAreaView>
  );
}
