import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';

interface NotificationBellProps {
  count: number;
  onPress: () => void;
}

export function NotificationBell({ count, onPress }: NotificationBellProps) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Lembretes, ${count} para hoje` : 'Lembretes'}
    >
      <Ionicons name="notifications-outline" size={22} color={palette.text} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -2,
      right: -2,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: c.red,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      ...typography.bodySemiBold,
      fontSize: 10,
      color: c.onColor,
    },
  });
