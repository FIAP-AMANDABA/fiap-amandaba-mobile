import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InfoHint, type InfoContent } from './InfoHint';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ScreenHeaderProps {
  title: string;
  info?: InfoContent;
  onBack?: () => void;
}

export function ScreenHeader({ title, info, onBack }: ScreenHeaderProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color={palette.text} />
        </TouchableOpacity>
      )}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {info && <InfoHint title={info.title} text={info.text} />}
      </View>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      gap: 2,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    title: {
      ...typography.heading,
      fontSize: 26,
      color: c.text,
    },
  });
