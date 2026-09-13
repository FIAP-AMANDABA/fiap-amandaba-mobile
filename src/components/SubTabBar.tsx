import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing } from '../styles/spacing';

interface SubTabBarProps<T extends string> {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

export function SubTabBar<T extends string>({ tabs, active, onChange }: SubTabBarProps<T>) {
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

const styles = StyleSheet.create({
  scroll: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
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
    borderBottomColor: colors.greenDark,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    color: colors.gray,
  },
  labelActive: {
    color: colors.greenDark,
  },
});
