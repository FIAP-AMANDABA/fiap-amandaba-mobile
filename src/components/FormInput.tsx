import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

export function FormInput({ style, ...props }: TextInputProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <TextInput
      placeholderTextColor={palette.textMuted}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    input: {
      ...typography.label,
      color: c.text,
      borderWidth: 1.5,
      borderColor: c.green,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.surface,
    },
  });
