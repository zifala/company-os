import { Link } from 'react-router-dom';
import { entryBySlug } from '../../content';
import { pieces } from '../../content/pieces';
import { Section } from '../blocks';
import { MarkdownView, recipeSource } from '../markdown-view';
import { PageTitle, Stack } from '../shell';

export function StandardPage() {
    const standard = recipeSource('standard') ?? '';
    const tail = standard.slice(standard.indexOf('## Placement'));

    return (
        <>
            <PageTitle title="The standard" lead="What every company operating system gets, whatever the business. One row per piece, one recipe per row." />
            <Stack>
                <Section title="Pieces" subtitle={`${pieces.length} rows. Click a row for the recipe.`}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground">
                                <th scope="col" className="px-5 py-2 font-medium">#</th>
                                <th scope="col" className="px-2 py-2 font-medium">Piece</th>
                                <th scope="col" className="px-2 py-2 font-medium">Rule</th>
                                <th scope="col" className="px-5 py-2 font-medium">Components</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pieces.map((piece) => {
                                const built = piece.components.filter((slug) => entryBySlug(slug));

                                return (
                                    <tr key={piece.slug} className="border-t align-top">
                                        <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{piece.n}</td>
                                        <td className="px-2 py-2.5 font-medium whitespace-nowrap">
                                            <Link to={`/pieces/${piece.slug}`} className="hover:text-primary hover:underline">
                                                {piece.title}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-2.5 text-muted-foreground">{piece.summary}</td>
                                        <td className="px-5 py-2.5">
                                            <span className="flex flex-wrap gap-1">
                                                {built.map((slug) => (
                                                    <Link key={slug} to={`/components/${slug}`} className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary hover:bg-primary/15">
                                                        {slug}
                                                    </Link>
                                                ))}
                                                {built.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Section>
                <Section title="Placement and limits" subtitle="From standard.md, mirrored from the skill">
                    <div className="px-5 py-2">
                        <MarkdownView source={tail} />
                    </div>
                </Section>
            </Stack>
        </>
    );
}
