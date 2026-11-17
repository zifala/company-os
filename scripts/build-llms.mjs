import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './lib/load-entries.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.REGISTRY_BASE ?? 'http://localhost:5173';

const { entries, entryToMarkdown, pieces, blocks, templates } = await loadEntries(root);
const outDir = path.join(root, 'public', 'llms');
await mkdir(path.join(outDir, 'pieces'), { recursive: true });

for (const entry of entries) {
    await writeFile(path.join(outDir, `${entry.slug}.md`), entryToMarkdown(entry, BASE));
}

// The standard and its recipes, as the skill wrote them. The registry MCP reads these.
const recipes = path.join(root, 'src', 'docs', 'content', 'recipes');
await copyFile(path.join(recipes, 'standard.md'), path.join(outDir, 'pieces', 'standard.md'));
for (const piece of pieces) {
    await copyFile(path.join(recipes, `${piece.slug}.md`), path.join(outDir, 'pieces', `${piece.slug}.md`));
}

// One machine index: what search tools (the registry MCP) rank over.
const machineIndex = {
    base: BASE,
    install: `npx shadcn@latest add ${BASE}/r/<name>.json`,
    components: entries.map((entry) => ({
        name: entry.slug,
        title: entry.name,
        category: entry.category,
        tagline: entry.tagline,
        job: entry.job,
        tags: entry.tags,
        pieces: entry.pieces,
        exports: entry.exports,
        doc: `llms/${entry.slug}.md`,
    })),
    compositions: [...(blocks ?? []), ...(templates ?? [])].map((comp) => ({
        name: `${comp.kind}-${comp.slug}`,
        title: comp.name,
        kind: comp.kind,
        tagline: comp.tagline,
        description: comp.description.join(' ').replace(/<[^>]+>/g, ''),
        tags: comp.tags,
        pieces: comp.pieces,
        deps: comp.deps,
    })),
    pieces: pieces.map((piece) => ({ n: piece.n, name: piece.slug, title: piece.title, summary: piece.summary, components: piece.components, doc: `llms/pieces/${piece.slug}.md` })),
};
await writeFile(path.join(outDir, 'index.json'), JSON.stringify(machineIndex, null, 2));

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
console.log(`llms: index + ${entries.length} markdown docs + ${pieces.length} pieces + index.json → public/`);
