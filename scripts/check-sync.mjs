import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = process.env.COMPANY_OS_SKILL ?? path.join(process.env.HOME ?? '', '.claude', 'skills', 'company-os');
const mirror = path.join(root, 'src', 'docs', 'content', 'recipes');

const sources = [
    ['standard.md', path.join(skill, 'standard.md')],
    ...(await readdir(path.join(skill, 'recipes')))
        .filter((file) => file.endsWith('.md'))
        .map((file) => [file, path.join(skill, 'recipes', file)]),
];

const drift = [];
for (const [file, source] of sources) {
    const [a, b] = await Promise.all([
        readFile(source, 'utf8'),
        readFile(path.join(mirror, file), 'utf8').catch(() => null),
    ]);
    if (a !== b) drift.push(file);
}

if (drift.length) {
    console.error(`SYNC · ${drift.length} drift(s): ${drift.join(', ')}`);
    console.error('Run: pnpm sync:recipes');
    process.exit(1);
}

console.log(`SYNC · clean. ${sources.length} mirrored file(s) match the skill.`);
