import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Composition } from '../content/compositions';
import { compositionRender } from '../compositions';
import { registryBase } from './base';
import { CodeBlock, CopyButton, RichText, Section } from './blocks';

export function CompositionCard({ comp }: { comp: Composition }) {
    const [tab, setTab] = useState<'preview' | 'code' | 'install'>('preview');
    const render = compositionRender[comp.slug];
    if (!render) return null;
    const Demo = render.Component;
    const cli = `npx shadcn@latest add ${registryBase()}/r/${comp.kind}-${comp.slug}.json`;
    const tabs: { id: typeof tab; label: string }[] = [
        { id: 'preview', label: 'Preview' },
        { id: 'code', label: 'Code' },
        { id: 'install', label: 'Install' },
    ];

    return (
        <Section
            title={comp.name}
            subtitle={comp.tagline}
            action={comp.kind === 'template' ? <Link className="text-xs font-medium text-primary hover:underline" to={`/templates/${comp.slug}`}>Full screen</Link> : undefined}
        >
            {comp.description[0] && (
                <p className="px-5 pt-3 text-sm text-muted-foreground">
                    <RichText text={comp.description[0]} />
                </p>
            )}
            <div className="flex items-end justify-between pt-1">
                <div role="tablist" className="flex flex-1 gap-1 border-b px-5">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            role="tab"
                            type="button"
                            aria-selected={item.id === tab}
                            onClick={() => setTab(item.id)}
                            className={`-mb-px border-b-2 px-2 py-2 text-xs font-medium ${item.id === tab ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                {tab !== 'preview' && <div className="border-b pr-3"><CopyButton text={tab === 'code' ? render.source : cli} done="Copied" /></div>}
            </div>
            {tab === 'preview' && (
                <div className="max-h-[640px] overflow-auto rounded-b-lg bg-background/60 p-5">
                    <Demo />
                </div>
            )}
            {tab === 'code' && <CodeBlock code={render.source} />}
            {tab === 'install' && (
                <div className="p-5">
                    <CodeBlock code={cli} framed />
                    <p className="text-sm text-muted-foreground">
                        Installs the source and pulls {comp.deps.length} component{comp.deps.length === 1 ? '' : 's'} plus the token set.
                    </p>
                </div>
            )}
        </Section>
    );
}
