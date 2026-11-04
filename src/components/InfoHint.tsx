import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Palette } from '../theme/palettes';
import { useTheme } from '../theme/ThemeProvider';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface InfoContent {
  title: string;
  text: string;
}

export function InfoHint({ title, text }: InfoContent) {
  const styles = useThemedStyles(createStyles);
  const { palette } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Ajuda: ${title}`}
      >
        <Ionicons name="information-circle-outline" size={24} color={palette.greenDark} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity style={styles.close} activeOpacity={0.8} onPress={() => setVisible(false)}>
              <Text style={styles.closeLabel}>ENTENDI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdrop: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    title: {
      ...typography.heading,
      fontSize: 18,
      color: c.text,
    },
    text: {
      ...typography.body,
      color: c.textMuted,
      lineHeight: 20,
    },
    close: {
      marginTop: spacing.sm,
      borderWidth: 1.5,
      borderColor: c.greenDark,
      borderRadius: 12,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    closeLabel: {
      ...typography.label,
      color: c.greenDark,
    },
  });
