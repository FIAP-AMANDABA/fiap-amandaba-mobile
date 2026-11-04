import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';

export function ScreenLoading() {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.center}>
        <ActivityIndicator color={palette.greenDark} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
