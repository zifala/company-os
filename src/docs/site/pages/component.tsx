import { Link, Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { entries } from '../../content';
import { entryToMarkdown } from '../../content/markdown';
import { pieceBySlug, pieces } from '../../content/pieces';
import { demos } from '../../demos';
import { registryBase } from '../base';
import { A11yCard, DontsCard, FaqCard, InstallCard, PreviewCode, PropsCard, Prose, RichText, Section } from '../blocks';
import { PageTitle, Stack } from '../shell';

export function ComponentPage() {
    const { slug } = useParams();
    const index = entries.findIndex((entry) => entry.slug === slug);
    if (index === -1) return <Navigate to="/components" replace />;
    const entry = entries[index];
    const prev = entries[index - 1];
    const next = entries[index + 1];
    const base = registryBase();
    const linkedPieces = entry.pieces.map((n) => pieces[n - 1]).filter((piece) => piece !== undefined);

    return (
        <>
            <PageTitle
                title={entry.name}
                lead={entry.tagline}
                actions={
                    <>
                        <Button variant="outline" asChild>
                            <a href={`${base}/llms/${entry.slug}.md`} target="_blank" rel="noreferrer">
                                View as markdown
                            </a>
                        </Button>
                        <Button
                            onClick={() => {
                                void navigator.clipboard.writeText(entryToMarkdown(entry, base)).then(() => toast.success('Page copied as markdown'));
                            }}
                        >
                            Copy page for AI
                        </Button>
                    </>
                }
            />
            <Stack>
                <Section title="Overview" subtitle={`One job: ${entry.job}`}>
                    <Prose>
                        {entry.intro.map((paragraph) => (
                            <p key={paragraph}><RichText text={paragraph} /></p>
                        ))}
                    </Prose>
                    {linkedPieces.length > 0 && (
                        <p className="flex flex-wrap gap-1 border-t px-5 py-3 text-xs text-muted-foreground">
                            <span className="mr-1">Pieces:</span>
                            {linkedPieces.map((piece) => (
                                <Link key={piece.slug} to={`/pieces/${piece.slug}`} className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary hover:bg-primary/15">
                                    {piece.n} · {pieceBySlug(piece.slug)?.title}
                                </Link>
                            ))}
                        </p>
                    )}
                </Section>
                <InstallCard entry={entry} base={base} />
                {entry.examples.map((example) => {
                    const Demo = demos[example.demoKey];

                    return <PreviewCode key={example.demoKey} example={example} demo={Demo ? <Demo /> : <p className="text-sm text-muted-foreground">Demo missing: {example.demoKey}</p>} />;
                })}
                <PropsCard groups={entry.props} />
                <div className="grid gap-5 lg:grid-cols-2">
                    <A11yCard a11y={entry.a11y} />
                    <DontsCard donts={entry.donts} />
                </div>
                <FaqCard faq={entry.faq} />
                <div className="flex justify-between">
                    <div>{prev && <Button variant="ghost" asChild><Link to={`/components/${prev.slug}`}>← {prev.name}</Link></Button>}</div>
                    <div>{next && <Button variant="ghost" asChild><Link to={`/components/${next.slug}`}>{next.name} →</Link></Button>}</div>
                </div>
            </Stack>
        </>
    );
}
