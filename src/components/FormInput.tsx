import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export function FormInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.black}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.label,
    color: colors.black,
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
});
