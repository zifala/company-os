import { CheckIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { Pill } from '@/components/company-os/pill';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from '@/lib/navigation';

export type Insight = {
    id: string;
    title: string;
    body: string;
    agent: string;
    kind: string;
    written: boolean;
    severity: { label: string; color: string };
    status: { value: string; label: string; live: boolean };
    updated_label: string;
    date_label: string | null;
    evidence: { text: string; links: { label: string; href: string }[] }[];
    suggestions: { index: number; type: string; label: string; reason: string; applied: boolean }[];
};

export type InsightLabels = { evidence: string; written: string; applied: string; applying: string; markSeen: string; dismiss: string };

export const insightLabels: InsightLabels = {
    evidence: 'Evidence',
    written: 'Worded by the model from the cited numbers',
    applied: 'Applied',
    applying: 'Applying',
    markSeen: 'Mark seen',
    dismiss: 'Dismiss',
};

export function InsightItem({
    insight,
    evidenceOpen = false,
    pending,
    onApply,
    onAcknowledge,
    onDismiss,
    labels = insightLabels,
}: {
    insight: Insight;
    evidenceOpen?: boolean;
    pending?: number | null;
    onApply: (index: number) => void;
    onAcknowledge: () => void;
    onDismiss: () => void;
    labels?: InsightLabels;
}) {
    return (
        <article className="grid gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Pill name={insight.severity.label} color={insight.severity.color} />
                <span>
                    {insight.agent} · {insight.kind}
                </span>
                {!insight.status.live && <span>· {insight.status.label}</span>}
                <time className="ms-auto" title={insight.date_label ?? undefined}>
                    {insight.updated_label}
                </time>
            </div>
            <h3 className="text-sm font-bold text-foreground">{insight.title}</h3>
            <p className="text-sm whitespace-pre-wrap">{insight.body}</p>
            {insight.written && (
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <SparklesIcon className="size-3.5 text-primary" aria-hidden />
                    {labels.written}
                </p>
            )}
            {insight.evidence.length > 0 && (
                <Collapsible defaultOpen={evidenceOpen} className="group/evidence">
                    <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground transition-all duration-300 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
                        <ChevronRightIcon className="size-3.5 transition-transform duration-300 group-data-[state=open]/evidence:rotate-90" aria-hidden />
                        {labels.evidence} · {insight.evidence.length}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ol className="mt-2 grid gap-2 rounded-lg bg-foreground/5 px-3 py-2.5">
                            {insight.evidence.map((line, index) => (
                                <li key={index} className="grid gap-1 text-xs leading-relaxed">
                                    <span className="tabular-nums">{line.text}</span>
                                    {line.links.length > 0 && (
                                        <span className="flex flex-wrap gap-1.5">
                                            {line.links.map((link, linkIndex) => (
                                                <Link key={linkIndex} href={link.href} className="rounded-full bg-card/60 px-2 py-0.5 font-medium text-foreground transition-all duration-300 hover:bg-primary/5 hover:text-primary">
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </CollapsibleContent>
                </Collapsible>
            )}
            {insight.suggestions.length > 0 && (
                <ul className="grid gap-2">
                    {insight.suggestions.map((suggestion) => (
                        <li key={suggestion.index} className="flex items-start justify-between gap-3 text-sm">
                            <div className="grid min-w-0 gap-0.5">
                                <span className="font-medium text-foreground">{suggestion.label}</span>
                                <span className="text-xs text-muted-foreground">{suggestion.reason}</span>
                            </div>
                            {suggestion.applied ? (
                                <span className="inline-flex h-8 shrink-0 items-center gap-1 text-xs text-success">
                                    <CheckIcon className="size-3.5" aria-hidden />
                                    {labels.applied}
                                </span>
                            ) : (
                                <Button size="sm" variant="outline" className="shrink-0" disabled={!insight.status.live || pending != null} onClick={() => onApply(suggestion.index)}>
                                    {pending === suggestion.index ? labels.applying : suggestion.type}
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {insight.status.live && (
                <div className="flex items-center justify-end gap-2">
                    {insight.status.value === 'open' && (
                        <Button size="sm" variant="ghost" disabled={pending != null} onClick={onAcknowledge}>
                            {labels.markSeen}
                        </Button>
                    )}
                    <Button size="sm" variant="ghost" disabled={pending != null} onClick={onDismiss}>
                        {labels.dismiss}
                    </Button>
                </div>
            )}
        </article>
    );
}
