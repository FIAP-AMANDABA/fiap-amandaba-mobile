import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SubTabBarProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function SubTabBar<T extends string>({ tabs, active, onChange }: SubTabBarProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity key={tab.key} onPress={() => onChange(tab.key)} activeOpacity={0.7}>
              <View style={[styles.tab, isActive && styles.tabActive]}>
                <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    scroll: {
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    row: {
      flexDirection: 'row',
    },
    tab: {
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.sm,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: c.greenDark,
    },
    label: {
      ...typography.label,
      fontSize: 13,
      color: c.textMuted,
    },
    labelActive: {
      color: c.greenDark,
    },
  });
