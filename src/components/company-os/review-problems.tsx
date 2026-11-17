import { CheckIcon, CircleAlertIcon } from 'lucide-react';
import { Pill } from '@/components/company-os/pill';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ReviewSection = {
    key: string;
    label: string;
    problems: string[];
};

export type ReviewProblemsLabels = { ready: string; problems: (count: number) => string; fix: string; allReady: string };

export const reviewProblemsLabels: ReviewProblemsLabels = {
    ready: 'Ready',
    problems: (count) => (count === 1 ? '1 problem' : `${count} problems`),
    fix: 'Fix',
    allReady: 'Everything is in. Submit when you are sure.',
};

export function ReviewProblems({
    sections,
    onFix,
    labels = reviewProblemsLabels,
}: {
    sections: ReviewSection[];
    onFix?: (key: string) => void;
    labels?: ReviewProblemsLabels;
}) {
    const total = sections.reduce((sum, section) => sum + section.problems.length, 0);

    return (
        <section className="rounded-lg glass">
            <ol>
                {sections.map((section) => {
                    const ok = section.problems.length === 0;
                    const Icon = ok ? CheckIcon : CircleAlertIcon;

                    return (
                        <li key={section.key} className="flex gap-3 border-b border-border px-5 py-3 last:border-0">
                            <span className={cn('mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full', ok ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                                <Icon className="size-3.5" aria-hidden />
                            </span>
                            <div className="grid min-w-0 flex-1 gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{section.label}</span>
                                    <Pill name={ok ? labels.ready : labels.problems(section.problems.length)} color={ok ? 'emerald' : 'rose'} />
                                </div>
                                {!ok && (
                                    <ul className="list-inside list-disc text-sm text-muted-foreground">
                                        {section.problems.map((problem, index) => (
                                            <li key={index}>{problem}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {!ok && onFix && (
                                <Button variant="outline" size="sm" aria-label={`${labels.fix}: ${section.label}`} onClick={() => onFix(section.key)}>
                                    {labels.fix}
                                </Button>
                            )}
                        </li>
                    );
                })}
            </ol>
            {total === 0 && <p className="border-t border-border px-5 py-3 text-sm text-muted-foreground">{labels.allReady}</p>}
        </section>
    );
}
