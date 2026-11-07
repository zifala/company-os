import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './lib/load-entries.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.REGISTRY_BASE ?? 'http://localhost:5173';

const { entries, entryToMarkdown, pieces, blocks, templates } = await loadEntries(root);
const outDir = path.join(root, 'public', 'llms');
await mkdir(outDir, { recursive: true });

for (const entry of entries) {
    await writeFile(path.join(outDir, `${entry.slug}.md`), entryToMarkdown(entry, BASE));
}

const index = `# Company OS

> The standard every company operating system gets, and the React components that ship it.
> Laravel + Inertia React + shadcn/ui. Source distribution (shadcn-compatible registry at ${BASE}/r/).
> Install: npx shadcn@latest add ${BASE}/r/<name>.json

## The standard

${pieces.map((piece) => `- ${piece.n}. [${piece.title}](${BASE}/pieces/${piece.slug}): ${piece.summary}`).join('\n')}

## Foundations

- [Tokens](${BASE}/r/tokens.json): the required CSS token set (shadcn + success, warning, info, field) and the navigation seam.

## Components

${entries.map((entry) => `- [${entry.name}](${BASE}/llms/${entry.slug}.md): ${entry.tagline} One job: ${entry.job}`).join('\n')}

## Blocks

${(blocks ?? []).map((block) => `- ${block.name} (\`block-${block.slug}\`): ${block.tagline}`).join('\n')}

## Templates

${(templates ?? []).map((template) => `- ${template.name} (\`template-${template.slug}\`): ${template.tagline}`).join('\n')}

## Rules that bind every component

- Semantic tokens only. The consumer's app.css owns palette, radius and fonts.
- Nothing above a page title. The page header owns its create action.
- Lists are tables. Every cell is typed. Empty keeps the table.
- Every status change goes through a confirm or reason dialog.
- Navigation is data: one list drives the sidebar, the landing redirect and the palette.
`;

await writeFile(path.join(root, 'public', 'llms.txt'), index);
console.log(`llms: index + ${entries.length} markdown docs → public/`);
