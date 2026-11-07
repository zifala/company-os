import type { DocEntry } from './types';

export function decodeEntities(text: string): string {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
}

const strip = (text: string) =>
    decodeEntities(text.replace(/<b>|<\/b>/g, '**').replace(/<code>|<\/code>/g, '`'));

export function entryToMarkdown(entry: DocEntry, base: string): string {
    const lines: string[] = [];
    lines.push(`# ${entry.name} · Company OS`);
    lines.push('');
    lines.push(entry.tagline);
    lines.push('');
    lines.push(`**One job:** ${entry.job}`);
    lines.push(`**Category:** ${entry.category} · **Pieces:** ${entry.pieces.join(', ')} · **Exports:** ${entry.exports.join(', ')} · **Tags:** ${entry.tags.join(', ')}`);
    lines.push('');
    lines.push('## Installation');
    lines.push('');
    lines.push('```bash');
    lines.push(`npx shadcn@latest add ${base}/r/${entry.slug}.json`);
    lines.push('```');
    lines.push('');
    lines.push(`Manual: copy ${entry.files.join(', ')} into your project (plus lib/navigation.tsx and the token set).`);
    if (entry.registryDeps?.length) {
        lines.push(`Company OS dependencies: ${entry.registryDeps.join(', ')}.`);
    }
    if (entry.shadcnDeps?.length) {
        lines.push(`shadcn primitives: ${entry.shadcnDeps.join(', ')}.`);
    }
    lines.push('');
    lines.push('## Overview');
    lines.push('');
    for (const paragraph of entry.intro) lines.push(strip(paragraph), '');
    lines.push('## Examples');
    for (const example of entry.examples) {
        lines.push('', `### ${example.title}`, '');
        if (example.description) lines.push(strip(example.description), '');
        lines.push('```tsx', example.code.trim(), '```');
    }
    lines.push('', '## Props');
    for (const group of entry.props) {
        lines.push('', `### ${group.component}`, '');
        lines.push('| Prop | Type | Default | Description |');
        lines.push('| --- | --- | --- | --- |');
        for (const row of group.rows) {
            lines.push(`| \`${row.name}\` | \`${row.type}\` | ${row.defaultValue ? `\`${row.defaultValue}\`` : '—'} | ${strip(row.description)} |`);
        }
    }
    lines.push('', '## Accessibility');
    if (entry.a11y.keyboard?.length) {
        lines.push('', '| Keys | Action |', '| --- | --- |');
        for (const key of entry.a11y.keyboard) lines.push(`| ${key.keys} | ${key.action} |`);
    }
    lines.push('');
    for (const note of entry.a11y.notes) lines.push(`- ${strip(note)}`);
    lines.push('', "## Don't");
    lines.push('');
    for (const dont of entry.donts) lines.push(`- ${strip(dont)}`);
    lines.push('', '## FAQ');
    for (const item of entry.faq) {
        lines.push('', `**${item.q}**`, '', strip(item.a));
    }
    lines.push('');

    return lines.join('\n');
}
