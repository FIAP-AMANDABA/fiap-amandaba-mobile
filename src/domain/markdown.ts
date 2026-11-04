// Subconjunto de Markdown suficiente para o texto da IA: títulos, negrito, listas e separador.

export interface InlineSpan {
  text: string;
  bold: boolean;
}

export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; spans: InlineSpan[] }
  | { type: 'paragraph'; spans: InlineSpan[] }
  | { type: 'listItem'; level: 0 | 1 | 2; marker: string; spans: InlineSpan[] }
  | { type: 'rule' };

export function parseInline(text: string): InlineSpan[] {
  const spans: InlineSpan[] = [];

  text
    .replace(/`/g, '')
    .split(/(\*\*[^*]+\*\*)/g)
    .forEach((part) => {
      if (!part) return;
      const isBold = part.startsWith('**') && part.endsWith('**') && part.length > 4;
      const clean = (isBold ? part.slice(2, -2) : part).replace(/\*/g, '');
      if (clean) spans.push({ text: clean, bold: isBold });
    });

  return spans;
}

const HEADING = /^\s*(#{1,6})\s+(.*)$/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const BULLET = /^(\s*)[*\-+]\s+(.*)$/;
const NUMBERED = /^(\s*)(\d+)[.)]\s+(.*)$/;

const levelFor = (indent: string): 0 | 1 | 2 => {
  const size = indent.replace(/\t/g, '    ').length;
  return size >= 8 ? 2 : size >= 2 ? 1 : 0;
};

export function parseMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];

  for (const line of source.replace(/\r/g, '').split('\n')) {
    if (!line.trim()) continue;

    if (RULE.test(line)) {
      blocks.push({ type: 'rule' });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      blocks.push({ type: 'heading', level, spans: parseInline(heading[2]) });
      continue;
    }

    const numbered = line.match(NUMBERED);
    if (numbered) {
      blocks.push({ type: 'listItem', level: levelFor(numbered[1]), marker: `${numbered[2]}.`, spans: parseInline(numbered[3]) });
      continue;
    }

    const bullet = line.match(BULLET);
    if (bullet) {
      blocks.push({ type: 'listItem', level: levelFor(bullet[1]), marker: '•', spans: parseInline(bullet[2]) });
      continue;
    }

    blocks.push({ type: 'paragraph', spans: parseInline(line.trim()) });
  }

  return blocks;
}
