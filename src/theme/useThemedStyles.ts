import { useMemo } from 'react';
import type { Palette } from './palettes';
import { useTheme } from './ThemeProvider';

export function useThemedStyles<T>(factory: (palette: Palette) => T): T {
  const { palette } = useTheme();
  return useMemo(() => factory(palette), [factory, palette]);
}
