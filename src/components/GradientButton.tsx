import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

interface GradientButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export function GradientButton({ label, onPress }: GradientButtonProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        colors={[palette.green, palette.greenDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    button: {
      borderRadius: 32,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...typography.button,
      color: c.onPrimary,
    },
  });
