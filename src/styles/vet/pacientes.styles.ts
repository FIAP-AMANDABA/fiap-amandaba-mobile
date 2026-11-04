import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { typography } from '../../theme/typography';

export const createPacientesStyles = (c: Palette) =>
  StyleSheet.create({
    subtitle: {
      ...typography.body,
      color: c.textMuted,
    },
  });
