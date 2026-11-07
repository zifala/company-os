import type { ReactNode } from 'react';
import { PageHeader } from '@/components/company-os/page-header';
import { cn } from '@/lib/utils';

export function FormLayout({
    title,
    actions,
    side,
    children,
}: {
    title: string;
    actions: ReactNode;
    side?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
                <PageHeader title={title}>{actions}</PageHeader>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="grid gap-6">{children}</div>
                {side && <div className="grid gap-6">{side}</div>}
            </div>
        </div>
    );
}

export function FormSection({
    title,
    compact = false,
    children,
}: {
    title: string;
    compact?: boolean;
    children: ReactNode;
}) {
    return (
        <section className="rounded-lg glass">
            <h2 className="border-b border-border px-5 py-3 text-sm font-semibold text-slate-800">{title}</h2>
            <div className={cn('grid gap-x-4 gap-y-4 p-5', !compact && 'sm:grid-cols-2')}>{children}</div>
        </section>
    );
}
