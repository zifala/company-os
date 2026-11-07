import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEntries } from './lib/load-entries.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.REGISTRY_BASE ?? 'http://localhost:5173';
const SYSTEM = 'Company OS';

const { entries, compositions } = await loadEntries(root);
const outDir = path.join(root, 'public', 'r');
await mkdir(outDir, { recursive: true });

async function fileEntry(relPath, target = relPath) {
    const abs = path.join(root, relPath.startsWith('registry/') ? relPath : path.join('src', relPath));
    const content = await readFile(abs, 'utf8');
    const type = relPath.endsWith('.css')
        ? 'registry:file'
        : relPath.includes('/lib/') || relPath.startsWith('registry/') || relPath.includes('/hooks/')
          ? 'registry:lib'
          : 'registry:ui';

    return { path: `registry/company-os/${path.basename(relPath)}`, content, type, target };
}

const tokensItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: 'tokens',
    type: 'registry:theme',
    title: 'Company OS tokens',
    description:
        'The required token set (shadcn + success, warning, info, field) with sample values, the cn helper, and the Inertia navigation seam every component imports.',
    files: [
        await fileEntry('styles/tokens.css'),
        await fileEntry('lib/utils.ts'),
        await fileEntry('registry/adapters/navigation.inertia.tsx', 'lib/navigation.tsx'),
    ],
    meta: { system: SYSTEM, category: 'foundations', tags: ['tokens', 'css-variables', 'navigation-seam'] },
};
await writeFile(path.join(outDir, 'tokens.json'), JSON.stringify(tokensItem, null, 2));

const items = [];
for (const entry of entries) {
    const item = {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name: entry.slug,
        type: 'registry:ui',
        title: entry.name,
        description: `${entry.tagline} One job: ${entry.job}`,
        registryDependencies: [
            `${BASE}/r/tokens.json`,
            ...(entry.registryDeps ?? []).map((dep) => `${BASE}/r/${dep}.json`),
            ...(entry.shadcnDeps ?? []),
        ],
        files: await Promise.all(entry.files.map((file) => fileEntry(file))),
        categories: [entry.category],
        docs: `${BASE}/llms/${entry.slug}.md`,
        meta: { system: SYSTEM, pieces: entry.pieces, job: entry.job, tags: entry.tags, exports: entry.exports },
    };
    await writeFile(path.join(outDir, `${entry.slug}.json`), JSON.stringify(item, null, 2));
    items.push({
        name: entry.slug,
        type: 'registry:ui',
        title: entry.name,
        description: item.description,
        categories: [entry.category],
        files: entry.files.map((file) => ({ path: file, type: 'registry:ui' })),
    });
}

const blockItems = [];
for (const comp of compositions ?? []) {
    const name = `${comp.kind}-${comp.slug}`;
    const files = await Promise.all(
        comp.files.map(async (file) => ({
            path: `registry/company-os/${file}`,
            content: await readFile(path.join(root, 'src', file), 'utf8'),
            type: 'registry:ui',
            target: `components/company-os/${file}`,
        })),
    );
    const item = {
        $schema: 'https://ui.shadcn.com/schema/registry-item.json',
        name,
        type: 'registry:block',
        title: comp.name,
        description: comp.tagline,
        registryDependencies: [`${BASE}/r/tokens.json`, ...comp.deps.map((dep) => `${BASE}/r/${dep}.json`)],
        files,
        categories: [comp.kind === 'block' ? 'blocks' : 'templates'],
        meta: { system: SYSTEM, kind: comp.kind, pieces: comp.pieces, tags: comp.tags },
    };
    await writeFile(path.join(outDir, `${name}.json`), JSON.stringify(item, null, 2));
    blockItems.push({ name, type: 'registry:block', title: comp.name, description: comp.tagline, categories: item.categories, files: comp.files.map((file) => ({ path: file, type: 'registry:block' })) });
}

const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'company-os',
    homepage: BASE,
    items: [{ name: 'tokens', type: 'registry:theme', title: 'Company OS tokens', description: tokensItem.description }, ...items, ...blockItems],
};
await writeFile(path.join(outDir, 'registry.json'), JSON.stringify(registry, null, 2));

console.log(`registry: ${items.length + 1} components + ${blockItems.length} blocks/templates → public/r/ (base: ${BASE})`);
