import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { parseMarkdown, type InlineSpan } from '../domain/markdown';
import type { Palette } from '../theme/palettes';
import { useThemedStyles } from '../theme/useThemedStyles';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface MarkdownTextProps {
  source: string;
}

export function MarkdownText({ source }: MarkdownTextProps) {
  const styles = useThemedStyles(createStyles);
  const blocks = useMemo(() => parseMarkdown(source), [source]);

  const renderSpans = (spans: InlineSpan[]) =>
    spans.map((span, index) => (
      <Text key={index} style={span.bold ? styles.bold : undefined}>
        {span.text}
      </Text>
    ));

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'rule':
            return <View key={index} style={styles.rule} />;
          case 'heading':
            return (
              <Text key={index} style={block.level === 1 ? styles.h1 : block.level === 2 ? styles.h2 : styles.h3}>
                {renderSpans(block.spans)}
              </Text>
            );
          case 'listItem':
            return (
              <View key={index} style={[styles.listItem, { paddingLeft: block.level * spacing.md }]}>
                <Text style={styles.marker}>{block.marker}</Text>
                <Text style={styles.body}>{renderSpans(block.spans)}</Text>
              </View>
            );
          default:
            return (
              <Text key={index} style={styles.body}>
                {renderSpans(block.spans)}
              </Text>
            );
        }
      })}
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    body: {
      ...typography.body,
      color: c.text,
      lineHeight: 20,
      flexShrink: 1,
    },
    bold: {
      ...typography.bodySemiBold,
    },
    h1: {
      ...typography.heading,
      fontSize: 22,
      color: c.text,
      marginTop: spacing.sm,
    },
    h2: {
      ...typography.heading,
      fontSize: 19,
      color: c.text,
      marginTop: spacing.sm,
    },
    h3: {
      ...typography.label,
      fontSize: 15,
      color: c.greenDark,
      marginTop: spacing.xs,
    },
    listItem: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    marker: {
      ...typography.body,
      color: c.greenDark,
      lineHeight: 20,
      minWidth: 14,
    },
    rule: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: spacing.xs,
    },
  });
