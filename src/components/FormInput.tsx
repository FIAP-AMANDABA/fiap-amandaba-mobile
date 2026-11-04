import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { maskDateBr } from '../utils/dateUtils';

type Props = TextInputProps & {
  mask?: 'date';
};

export function FormInput({ style, mask, onChangeText, ...props }: Props) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  const maskProps =
    mask === 'date'
      ? {
          keyboardType: 'numeric' as const,
          maxLength: 10,
          onChangeText: onChangeText && ((text: string) => onChangeText(maskDateBr(text))),
        }
      : { onChangeText };

  return (
    <TextInput
      placeholderTextColor={palette.textMuted}
      style={[styles.input, style]}
      {...props}
      {...maskProps}
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
