import { Link } from 'react-router-dom';
import { StatTileLite } from '../stat-tile-lite';
import { Button } from '@/components/ui/button';
import { entries } from '../../content';
import { compositions } from '../../content/compositions';
import { pieces } from '../../content/pieces';
import { demos } from '../../demos';
import { Prose, Section } from '../blocks';

const placement = [
    'Sidebar groups ordered daily → setup. Items permission-gated. Empty group hidden.',
    'Header: search + bell on the right. No create button up top.',
    'Page header owns its "+ Create". Nothing above the title.',
    'Personal Settings/ only for the user\'s own things. Platform config in Organization/.',
    'Empty state names the first action.',
];

export function HomePage() {
    const Specimen = demos['data-table-rows'];

    return (
        <div className="grid gap-6">
            <div className="max-w-3xl py-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Company OS</h1>
                <p className="mt-3 text-base text-muted-foreground">
                    What every company operating system gets, whatever the business: actions with audit, scoped permissions,
                    people lifecycle, settings, notifications, trash, import and export, bilingual copy, and one shell. This site
                    holds the standard and the React components that ship it, in the look they were built in.
                </p>
                <div className="mt-5 flex gap-2">
                    <Button asChild>
                        <Link to="/standard">Read the standard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/components">Browse components</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatTileLite value={String(pieces.length)} label="Pieces" hint="one recipe each, mirrored from the skill" />
                <StatTileLite value={String(entries.length)} label="Components" hint="converted from the reference product" />
                <StatTileLite value={String(compositions.length)} label="Blocks and templates" hint="composed from the components" />
                <StatTileLite value="1" label="Seam" hint="lib/navigation.tsx is the only Inertia import" />
            </div>

            <Section title="Invoices" subtitle="A live DataTable with typed cells. The same code the registry installs" action={<Link className="text-xs font-medium text-primary hover:underline" to="/components/data-table">View the spec</Link>}>
                <div className="p-5">{Specimen && <Specimen />}</div>
            </Section>

            <div className="grid gap-6 lg:grid-cols-2">
                <Section title="What this is" subtitle="A standard with a kit">
                    <Prose>
                        <p>
                            Twenty-seven pieces. Each has a rule, a shape, code, tests and gotchas, harvested from running products. The
                            pieces that have a screen also have a component here, converted into parts any Laravel + Inertia React project
                            installs with one command.
                        </p>
                        <p>
                            Components ship the Company OS theme: indigo on slate, glass panels, Inter. The theme is one{' '}
                            <code className="font-mono text-xs">app.css</code>; a product that needs its own brand changes the tokens there.
                            Navigation goes through one adapter so the same source runs on Inertia and in this site.
                        </p>
                        <p>Each component page: overview, install, live preview with code, props, accessibility, a Don't list, and an FAQ. The page you read is the markdown an assistant ingests.</p>
                    </Prose>
                </Section>
                <Section title="Placement" subtitle="The rules every screen follows">
                    <ol className="px-5 py-2">
                        {placement.map((rule, index) => (
                            <li key={rule} className="flex gap-3 border-b border-border py-2 text-sm text-muted-foreground last:border-0">
                                <span className="font-mono text-xs text-primary">{index + 1}</span>
                                {rule}
                            </li>
                        ))}
                    </ol>
                    <p className="px-5 pb-4 text-xs text-muted-foreground">Never travels: product modules, their permission lists, starter templates, home sections.</p>
                </Section>
            </div>
        </div>
    );
}
