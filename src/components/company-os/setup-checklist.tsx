import { CheckIcon, CircleDashedIcon, EyeIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Pill } from '@/components/company-os/pill';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type SetupStep = {
    key: string;
    title: string;
    done: boolean | null;
    links: { label: string; href: string }[];
};

export type SetupLabels = { done: string; todo: string; review: string; finish: string };

export const setupLabels: SetupLabels = { done: 'Done', todo: 'To do', review: 'Review', finish: 'Finish setup' };

function StepRow({ step, labels }: { step: SetupStep; labels: SetupLabels }) {
    const state = step.done === null ? 'review' : step.done ? 'done' : 'todo';
    const Icon = state === 'done' ? CheckIcon : state === 'review' ? EyeIcon : CircleDashedIcon;
    const color = state === 'done' ? 'emerald' : state === 'review' ? 'slate' : 'amber';

    return (
        <li className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3 last:border-0">
            <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', state === 'done' ? 'bg-success/10 text-success' : state === 'review' ? 'bg-muted-foreground/10 text-muted-foreground' : 'bg-warning/10 text-warning')}>
                <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{step.title}</span>
            <Pill name={labels[state]} color={color} />
            {step.links.map((link) => (
                <Button key={`${link.label}:${link.href}`} variant="outline" size="sm" asChild>
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </li>
    );
}

export function SetupChecklist({
    steps,
    onFinish,
    finishing,
    labels = setupLabels,
    children,
}: {
    steps: SetupStep[];
    onFinish: () => void;
    finishing: boolean;
    labels?: SetupLabels;
    children?: ReactNode;
}) {
    return (
        <div className="grid gap-6">
            <ol className="rounded-lg glass">
                {steps.map((step) => (
                    <StepRow key={step.key} step={step} labels={labels} />
                ))}
            </ol>
            {children}
            <div className="flex justify-end">
                <Button onClick={onFinish} disabled={finishing}>
                    {labels.finish}
                </Button>
            </div>
        </div>
    );
}
