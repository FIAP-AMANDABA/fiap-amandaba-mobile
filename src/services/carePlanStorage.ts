import AsyncStorage from '@react-native-async-storage/async-storage';

// Último plano de cada pet: gerar leva segundos e usa a cota da IA.
const PREFIX = 'amandaba:careplan:';

export interface SavedCarePlan {
  plan: string;
  generatedAt: string;
}

export async function loadCarePlan(petId: number): Promise<SavedCarePlan | null> {
  const stored = await AsyncStorage.getItem(`${PREFIX}${petId}`);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<SavedCarePlan>;
    return typeof parsed.plan === 'string' && typeof parsed.generatedAt === 'string'
      ? { plan: parsed.plan, generatedAt: parsed.generatedAt }
      : null;
  } catch {
    return null;
  }
}

export function saveCarePlan(petId: number, saved: SavedCarePlan): Promise<void> {
  return AsyncStorage.setItem(`${PREFIX}${petId}`, JSON.stringify(saved));
}

export async function clearCarePlans(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith(PREFIX)));
}
