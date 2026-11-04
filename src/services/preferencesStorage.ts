import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_MODE_KEY = 'amandaba:themeMode';

export type StoredThemeMode = 'system' | 'light' | 'dark';

export async function loadThemeMode(): Promise<StoredThemeMode> {
  const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

export async function saveThemeMode(mode: StoredThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_MODE_KEY, mode);
}
