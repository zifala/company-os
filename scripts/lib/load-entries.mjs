import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

export async function loadEntries(root) {
    const outDir = path.join(root, 'node_modules', '.company-os-tmp');
    await mkdir(outDir, { recursive: true });
    const entryFile = path.join(outDir, 'entry.ts');
    const src = path.join(root, 'src').replace(/\\/g, '/');
    await writeFile(
        entryFile,
        [
            `export { entries, categories } from '${src}/docs/content/index.ts';`,
            `export { entryToMarkdown } from '${src}/docs/content/markdown.ts';`,
            `export { pieces } from '${src}/docs/content/pieces.ts';`,
            `export { blocks, templates, compositions } from '${src}/docs/content/compositions.ts';`,
        ].join('\n'),
    );
    await build({
        configFile: false,
        logLevel: 'silent',
        publicDir: false,
        resolve: { alias: { '@': path.join(root, 'src') } },
        build: {
            ssr: entryFile,
            outDir,
            emptyOutDir: false,
            minify: false,
            rollupOptions: { output: { entryFileNames: 'entries.mjs' } },
        },
    });

    return import(`${pathToFileURL(path.join(outDir, 'entries.mjs')).href}?t=${Date.now()}`);
}
