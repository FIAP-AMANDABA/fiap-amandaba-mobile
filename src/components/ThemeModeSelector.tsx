import { PillSelector } from './PillSelector';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';

const OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'AUTOMÁTICO', value: 'system' },
  { label: 'CLARO', value: 'light' },
  { label: 'ESCURO', value: 'dark' },
];

export function ThemeModeSelector() {
  const { mode, setMode } = useTheme();

  return <PillSelector options={OPTIONS} value={mode} onChange={(value) => setMode(value as ThemeMode)} />;
}
