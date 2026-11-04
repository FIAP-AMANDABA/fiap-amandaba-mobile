import { StyleSheet } from 'react-native';
import type { Palette } from '../../theme/palettes';
import { typography } from '../../theme/typography';

export const createConsultasStyles = (c: Palette) =>
  StyleSheet.create({
    errorText: {
      ...typography.bodySmall,
      color: c.red,
    },
  });
