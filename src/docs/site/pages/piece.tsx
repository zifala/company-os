import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { entryBySlug } from '../../content';
import { pieceBySlug, pieces } from '../../content/pieces';
import { Section } from '../blocks';
import { MarkdownView, recipeSource } from '../markdown-view';
import { PageTitle, Stack } from '../shell';

export function PiecePage() {
    const { slug } = useParams();
    const piece = slug ? pieceBySlug(slug) : undefined;
    if (!piece) return <Navigate to="/standard" replace />;
    const source = recipeSource(piece.slug);
    const built = piece.components.map((entrySlug) => entryBySlug(entrySlug)).filter((entry) => entry !== undefined);
    const prev = pieces[piece.n - 2];
    const next = pieces[piece.n];

    return (
        <>
            <PageTitle title={`${piece.n}. ${piece.title}`} lead={piece.summary} />
            <Stack>
                {built.length > 0 && (
                    <Section title="Components" subtitle="The parts that ship this piece">
                        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                            {built.map((entry) => (
                                <Link key={entry.slug} to={`/components/${entry.slug}`} className="bg-card px-5 py-3 hover:bg-primary/5">
                                    <span className="block text-sm font-medium">{entry.name}</span>
                                    <span className="block text-xs text-muted-foreground">{entry.job}</span>
                                </Link>
                            ))}
                        </div>
                    </Section>
                )}
                <Section title="Recipe" subtitle={`recipes/${piece.slug}.md · rule, shape, code, placement, tests, gotchas`}>
                    <div className="px-5 py-2">
                        {source ? <MarkdownView source={source} /> : <p className="py-4 text-sm text-muted-foreground">No recipe yet. Build from the standard row.</p>}
                    </div>
                </Section>
                <div className="flex justify-between">
                    <div>{prev && <Button variant="ghost" asChild><Link to={`/pieces/${prev.slug}`}>← {prev.title}</Link></Button>}</div>
                    <div>{next && <Button variant="ghost" asChild><Link to={`/pieces/${next.slug}`}>{next.title} →</Link></Button>}</div>
                </div>
            </Stack>
        </>
    );
}
