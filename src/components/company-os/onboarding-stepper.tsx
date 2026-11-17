import { CornerUpLeftIcon, XIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { OnboardingRail } from '@/components/company-os/onboarding-rail';
import type { OnboardingStepItem } from '@/components/company-os/onboarding-rail';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export type SentBack = { reason: string; by: string; at: string };

export type OnboardingStepperLabels = {
    exit: string;
    back: string;
    next: string;
    submit: string;
    sentBack: (by: string, at: string) => string;
    stepOf: (index: number, total: number) => string;
};

export const onboardingStepperLabels: OnboardingStepperLabels = {
    exit: 'Exit',
    back: 'Back',
    next: 'Confirm and continue',
    submit: 'Submit for review',
    sentBack: (by, at) => `Sent back by ${by} on ${at}`,
    stepOf: (index, total) => `Step ${index} of ${total}`,
};

export function OnboardingStepper({
    title,
    reference,
    name,
    status,
    steps,
    current,
    furthest,
    onSelect,
    sentBack = null,
    exitHref = null,
    onBack,
    onContinue,
    processing,
    editable = true,
    labels = onboardingStepperLabels,
    children,
}: {
    title: string;
    reference: string;
    name: string;
    status: { label: string; color: string };
    steps: OnboardingStepItem[];
    current: string;
    furthest: number;
    onSelect: (key: string) => void;
    sentBack?: SentBack | null;
    exitHref?: Href | null;
    onBack: () => void;
    onContinue: () => void;
    processing: boolean;
    editable?: boolean;
    labels?: OnboardingStepperLabels;
    children: ReactNode;
}) {
    const index = Math.max(0, steps.findIndex((step) => step.key === current));
    const step = steps[index];
    const last = index === steps.length - 1;

    return (
        <div className="flex min-h-svh flex-col bg-background">
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 md:px-6">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</span>
                {exitHref !== null && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={exitHref}>
                            <XIcon /> {labels.exit}
                        </Link>
                    </Button>
                )}
            </header>
            <div className="flex flex-1 flex-col md:flex-row">
                <OnboardingRail reference={reference} name={name} status={status} steps={steps} current={current} furthest={furthest} onSelect={onSelect} disabled={processing} />
                <main className="flex min-w-0 flex-1 flex-col">
                    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-8">
                        {sentBack && (
                            <Alert>
                                <CornerUpLeftIcon />
                                <AlertTitle>{labels.sentBack(sentBack.by, sentBack.at)}</AlertTitle>
                                <AlertDescription>{sentBack.reason}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid gap-1">
                            <span className="text-xs text-muted-foreground">{labels.stepOf(index + 1, steps.length)}</span>
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">{step?.label}</h1>
                        </div>
                        <div className="grid gap-6">{children}</div>
                    </div>
                    <footer className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-sm">
                        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-8">
                            <Button variant="outline" onClick={onBack} disabled={index === 0 || processing}>
                                {labels.back}
                            </Button>
                            {editable && (
                                <Button onClick={onContinue} disabled={processing}>
                                    {last ? labels.submit : labels.next}
                                </Button>
                            )}
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
