import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { entries } from '../../content';
import { pieces } from '../../content/pieces';
import { registryBase } from '../base';
import { CodeBlock, Prose, Section } from '../blocks';
import { PageTitle, Stack } from '../shell';

export function AiPage() {
    const base = registryBase();
    const llms = `# Company OS

> The standard every company operating system gets, and the React components that ship it.

## The standard
${pieces.map((piece) => `- [${piece.title}](${base}/pieces/${piece.slug}): ${piece.summary}`).join('\n')}

## Components
${entries.map((entry) => `- [${entry.name}](${base}/llms/${entry.slug}.md): ${entry.tagline}`).join('\n')}
`;

    return (
        <>
            <PageTitle
                title="Built for assistants"
                lead="Registry items, markdown routes and llms.txt. Every page here is machine-readable by design."
                actions={
                    <Button
                        onClick={() => {
                            void navigator.clipboard.writeText(llms).then(() => toast.success('llms.txt copied'));
                        }}
                    >
                        Copy llms.txt
                    </Button>
                }
            />
            <Stack>
                <div className="grid gap-5 lg:grid-cols-2">
                    <Section title="Three mechanisms" subtitle="Registry → markdown → recipes">
                        <Prose>
                            <p><b>1 · The registry.</b> Every component is a shadcn-compatible item at <code className="font-mono text-xs">/r/&lt;slug&gt;.json</code>: description, tags, pieces, file contents, dependencies. <code className="font-mono text-xs">npx shadcn add &lt;url&gt;</code> installs it with the token set and the navigation seam.</p>
                            <p><b>2 · Markdown routes.</b> Doc pages are pure data, so the same source renders this site and emits <code className="font-mono text-xs">/llms/&lt;slug&gt;.md</code>. "Copy page for AI" yields the identical markdown. <code className="font-mono text-xs">/llms.txt</code> is the index.</p>
                            <p><b>3 · The recipes.</b> The 27 pieces are markdown already. The site mirrors them from the <code className="font-mono text-xs">company-os</code> skill, so an agent reading a piece page reads the recipe it builds from.</p>
                        </Prose>
                    </Section>
                    <Section title="For a Laravel project" subtitle="How an agent applies this">
                        <Prose>
                            <p>Run the <b>company-os</b> skill in the repo. It scores the repo against the standard, writes an ADR and a phased plan, then builds phase by phase with the recipe open beside the code.</p>
                            <p>Components install from this registry into <code className="font-mono text-xs">resources/js/components/company-os/</code>. The project keeps its own <code className="font-mono text-xs">app.css</code>; the parts take its colours.</p>
                            <p>Don't lists are the firewall in prose: a filled status pill, a breadcrumb, a native select, a table swapped for an empty card are defects, not choices.</p>
                        </Prose>
                    </Section>
                </div>
                <Section title="llms.txt" subtitle="Served at the site root">
                    <CodeBlock code={llms} />
                </Section>
            </Stack>
        </>
    );
}
