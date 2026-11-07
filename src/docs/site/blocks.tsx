import { useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { decodeEntities } from '../content/markdown';
import type { DocEntry, DocExample, KeyRow, PropRow } from '../content/types';

export function RichText({ text }: { text: string }) {
    const parts = text.split(/(<b>.*?<\/b>|<code>.*?<\/code>)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('<b>')) return <b key={index} className="font-semibold text-slate-800">{decodeEntities(part.slice(3, -4))}</b>;
                if (part.startsWith('<code>')) return <code key={index} className="rounded-md bg-slate-900/5 px-1 py-0.5 font-mono text-[0.8em] text-slate-800">{decodeEntities(part.slice(6, -7))}</code>;

                return decodeEntities(part);
            })}
        </>
    );
}

export function Section({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={cn('rounded-lg glass', className)}>
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
                <div>
                    <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('max-w-[72ch] space-y-3 px-5 py-4 text-sm leading-relaxed', className)}>{children}</div>;
}

export function CopyButton({ text, done }: { text: string; done: string }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => {
                void navigator.clipboard.writeText(text).then(() => toast.success(done));
            }}
        >
            Copy
        </Button>
    );
}

export function CodeBlock({ code, framed = false }: { code: string; framed?: boolean }) {
    return (
        <pre className={cn('site-code', framed && 'mx-5 mb-5 rounded-lg')}>
            <code>{code.trim()}</code>
        </pre>
    );
}

function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
    return (
        <div role="tablist" className="flex gap-1 border-b border-border px-5">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={tab.id === active}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        '-mb-px border-b-2 px-2 py-2 text-xs font-medium transition-all duration-300',
                        tab.id === active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary',
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export function PreviewCode({ example, demo }: { example: DocExample; demo: ReactNode }) {
    const [tab, setTab] = useState('preview');

    return (
        <Section title={example.title}>
            {example.description && (
                <p className="px-5 pt-3 text-sm text-muted-foreground">
                    <RichText text={example.description} />
                </p>
            )}
            <div className="flex items-end justify-between pt-1">
                <div className="flex-1">
                    <Tabs tabs={[{ id: 'preview', label: 'Preview' }, { id: 'code', label: 'Code' }]} active={tab} onChange={setTab} />
                </div>
                {tab === 'code' && <div className="border-b border-border pr-3"><CopyButton text={example.code.trim()} done="Code copied" /></div>}
            </div>
            {tab === 'preview' ? (
                <div className={cn('rounded-b-lg p-5', example.surface === 'card' ? 'bg-card' : 'bg-background/60')}>{demo}</div>
            ) : (
                <CodeBlock code={example.code} />
            )}
        </Section>
    );
}

export function PropsCard({ groups }: { groups: DocEntry['props'] }) {
    return (
        <Section title="Props" subtitle="Every prop, its type, and what it controls">
            {groups.map((group) => (
                <div key={group.component}>
                    <p className="px-5 pt-4 pb-1 font-mono text-xs text-muted-foreground">{group.component}</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-muted-foreground">
                                <th scope="col" className="px-5 py-2 font-medium">Prop</th>
                                <th scope="col" className="px-2 py-2 font-medium">Type</th>
                                <th scope="col" className="px-2 py-2 font-medium">Default</th>
                                <th scope="col" className="px-5 py-2 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.rows.map((row: PropRow) => (
                                <tr key={row.name} className="border-t border-border">
                                    <td className="px-5 py-2 font-mono text-xs whitespace-nowrap text-slate-800">{row.name}</td>
                                    <td className="px-2 py-2 font-mono text-xs text-primary">{row.type}</td>
                                    <td className="px-2 py-2 font-mono text-xs text-muted-foreground">{row.defaultValue ?? '—'}</td>
                                    <td className="px-5 py-2 text-muted-foreground"><RichText text={row.description} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </Section>
    );
}

export function A11yCard({ a11y }: { a11y: DocEntry['a11y'] }) {
    return (
        <Section title="Accessibility" subtitle="Keyboard and screen reader contract">
            {a11y.keyboard && a11y.keyboard.length > 0 && (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-muted-foreground">
                            <th scope="col" className="px-5 py-2 font-medium">Keys</th>
                            <th scope="col" className="px-5 py-2 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {a11y.keyboard.map((key: KeyRow) => (
                            <tr key={key.keys} className="border-t border-border">
                                <td className="px-5 py-2 font-mono text-xs whitespace-nowrap">{key.keys}</td>
                                <td className="px-5 py-2 text-muted-foreground">{key.action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Prose>
                {a11y.notes.map((note) => (
                    <p key={note}><RichText text={note} /></p>
                ))}
            </Prose>
        </Section>
    );
}

export function DontsCard({ donts }: { donts: string[] }) {
    return (
        <Section title="Don't" subtitle="Each of these is a defect, not a preference">
            <ul className="px-5 py-2">
                {donts.map((dont) => (
                    <li key={dont} className="flex gap-3 border-b border-border py-2 text-sm text-muted-foreground last:border-0">
                        <span className="font-bold text-rose-500">✕</span>
                        <span><RichText text={dont} /></span>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

export function FaqCard({ faq }: { faq: DocEntry['faq'] }) {
    return (
        <Section title="FAQ" subtitle="The API restated as questions">
            <div className="px-5 pb-2">
                {faq.map((item) => (
                    <details key={item.q} className="border-b border-border py-3 last:border-0">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-800 hover:text-primary">{item.q}</summary>
                        <p className="max-w-[68ch] pt-2 text-sm text-muted-foreground"><RichText text={item.a} /></p>
                    </details>
                ))}
            </div>
        </Section>
    );
}

export function InstallCard({ entry, base }: { entry: DocEntry; base: string }) {
    const [tab, setTab] = useState('cli');
    const cli = `npx shadcn@latest add ${base}/r/${entry.slug}.json`;

    return (
        <Section title="Installation" subtitle="Source distribution. The code lands in your project and you own it">
            <div className="flex items-end justify-between">
                <div className="flex-1">
                    <Tabs tabs={[{ id: 'cli', label: 'CLI' }, { id: 'manual', label: 'Manual' }]} active={tab} onChange={setTab} />
                </div>
                {tab === 'cli' && <div className="border-b border-border pr-3"><CopyButton text={cli} done="Command copied" /></div>}
            </div>
            {tab === 'cli' ? (
                <div className="p-5">
                    <CodeBlock code={cli} framed />
                    <p className="text-sm text-muted-foreground">
                        Pulls the theme, <code className="font-mono text-xs">lib/utils.ts</code> and <code className="font-mono text-xs">lib/navigation.tsx</code> as registry dependencies
                        {entry.shadcnDeps?.length ? `, plus shadcn ${entry.shadcnDeps.join(', ')}` : ''}.
                    </p>
                </div>
            ) : (
                <div className="p-5 text-sm text-muted-foreground">
                    <p>Copy these files. Every component needs <code className="font-mono text-xs">lib/navigation.tsx</code>, <code className="font-mono text-xs">lib/utils.ts</code> and the theme in your <code className="font-mono text-xs">app.css</code>.{entry.registryDeps?.length ? <> Also install: <b className="text-slate-800">{entry.registryDeps.join(', ')}</b>.</> : null}</p>
                    <ul className="mt-3 font-mono text-xs">
                        {entry.files.map((file) => (
                            <li key={file} className="border-b border-border py-1.5 last:border-0">{file}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Section>
    );
}
