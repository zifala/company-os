import { CheckIcon, LockIcon } from 'lucide-react';
import { Pill } from '@/components/company-os/pill';
import { cn } from '@/lib/utils';

export type OnboardingStepItem = {
    key: string;
    label: string;
    done: boolean;
};

export function stepLocked(steps: OnboardingStepItem[], index: number, furthest: number): boolean {
    return index > furthest && !steps[index]?.done;
}

export function OnboardingRail({
    reference,
    name,
    status,
    steps,
    current,
    furthest,
    onSelect,
    disabled = false,
    lockedLabel = 'Finish the steps before this one first',
    doneLabel = 'Done',
}: {
    reference: string;
    name: string;
    status: { label: string; color: string };
    steps: OnboardingStepItem[];
    current: string;
    furthest: number;
    onSelect: (key: string) => void;
    disabled?: boolean;
    lockedLabel?: string;
    doneLabel?: string;
}) {
    return (
        <aside className="flex flex-col gap-5 border-b border-border p-5 md:w-72 md:shrink-0 md:border-e md:border-b-0">
            <div className="grid gap-1.5">
                <span className="font-mono text-xs text-muted-foreground">{reference}</span>
                <span className="text-base font-semibold text-foreground">{name}</span>
                <span>
                    <Pill name={status.label} color={status.color} />
                </span>
            </div>
            <ol className="grid gap-1">
                {steps.map((step, index) => {
                    const locked = stepLocked(steps, index, furthest);
                    const active = step.key === current;

                    return (
                        <li key={step.key}>
                            <button
                                type="button"
                                disabled={locked || disabled}
                                aria-current={active ? 'step' : undefined}
                                title={locked ? lockedLabel : undefined}
                                onClick={() => onSelect(step.key)}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-md px-2 py-2 text-start text-sm transition-colors disabled:pointer-events-none',
                                    active ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-muted',
                                    locked && 'cursor-not-allowed text-muted-foreground hover:bg-transparent',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums',
                                        step.done ? 'border-transparent bg-success/10 text-success' : active ? 'border-primary text-primary' : 'border-border',
                                    )}
                                >
                                    {step.done ? <CheckIcon className="size-3.5" aria-hidden /> : locked ? <LockIcon className="size-3" aria-hidden /> : index + 1}
                                </span>
                                <span className="min-w-0 flex-1 truncate">{step.label}</span>
                                {(step.done || locked) && <span className="sr-only">{step.done ? doneLabel : lockedLabel}</span>}
                            </button>
                        </li>
                    );
                })}
            </ol>
        </aside>
    );
}
