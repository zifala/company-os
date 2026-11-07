import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = process.env.COMPANY_OS_SKILL ?? path.join(process.env.HOME ?? '', '.claude', 'skills', 'company-os');
const target = path.join(root, 'src', 'docs', 'content', 'recipes');

await mkdir(target, { recursive: true });
await copyFile(path.join(skill, 'standard.md'), path.join(target, 'standard.md'));

const recipes = (await readdir(path.join(skill, 'recipes'))).filter((file) => file.endsWith('.md'));
for (const file of recipes) {
    await copyFile(path.join(skill, 'recipes', file), path.join(target, file));
}

console.log(`recipes: standard + ${recipes.length} recipes → src/docs/content/recipes/`);
