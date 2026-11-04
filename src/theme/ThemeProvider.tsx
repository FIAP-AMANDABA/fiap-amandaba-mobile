import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { loadThemeMode, saveThemeMode, type StoredThemeMode } from '../services/preferencesStorage';
import { darkPalette, lightPalette, type Palette } from './palettes';

export type ThemeMode = StoredThemeMode;

interface ThemeContextValue {
  palette: Palette;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadThemeMode()
      .then(setModeState)
      .finally(() => setReady(true));
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void saveThemeMode(next);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
    return {
      palette: scheme === 'dark' ? darkPalette : lightPalette,
      isDark: scheme === 'dark',
      mode,
      setMode,
    };
  }, [mode, systemScheme, setMode]);

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}
