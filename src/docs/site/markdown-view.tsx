import { marked } from 'marked';

const recipes = import.meta.glob<string>('../content/recipes/*.md', { query: '?raw', import: 'default', eager: true });

export function recipeSource(slug: string): string | null {
    return recipes[`../content/recipes/${slug}.md`] ?? null;
}

export function MarkdownView({ source, className = '' }: { source: string; className?: string }) {
    const html = marked.parse(source, { async: false, gfm: true });

    return <div className={`site-md ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
