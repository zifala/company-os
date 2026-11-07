import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { blocks, templates } from '../../content/compositions';
import { compositionRender } from '../../compositions';
import { CompositionCard } from '../composition-card';
import { PageTitle, Stack } from '../shell';
import { TemplateShell } from '../template-shell';

function Empty({ what }: { what: string }) {
    return <p className="rounded-lg glass px-5 py-10 text-center text-sm text-muted-foreground">No {what} yet. They arrive with the next phase; see the roadmap.</p>;
}

export function BlocksPage() {
    return (
        <>
            <PageTitle title="Blocks" lead={`${blocks.length} composed sections. Built only from the components. Install one and own the source.`} />
            <Stack>{blocks.length === 0 ? <Empty what="blocks" /> : blocks.map((comp) => <CompositionCard key={comp.slug} comp={comp} />)}</Stack>
        </>
    );
}

export function TemplatesPage() {
    return (
        <>
            <PageTitle title="Templates" lead={`${templates.length} full screens. Open one full screen, or install it and make it yours.`} />
            <Stack>{templates.length === 0 ? <Empty what="templates" /> : templates.map((comp) => <CompositionCard key={comp.slug} comp={comp} />)}</Stack>
        </>
    );
}

export function TemplateViewPage() {
    const { slug } = useParams();
    const comp = templates.find((template) => template.slug === slug);
    const render = slug ? compositionRender[slug] : undefined;
    if (!comp || !render) return <Navigate to="/templates" replace />;
    const Demo = render.Component;

    return (
        <div className="min-h-svh">
            <TemplateShell>
                <Demo />
            </TemplateShell>
            <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 shadow-md" asChild>
                <Link to="/templates">← Templates</Link>
            </Button>
        </div>
    );
}
