import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import type { Palette } from './palettes';

export function buildNavigationTheme(palette: Palette): Theme {
  const base = palette.scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.greenDark,
      background: palette.background,
      card: palette.surface,
      text: palette.text,
      border: palette.border,
    },
  };
}
