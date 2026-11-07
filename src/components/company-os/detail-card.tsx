import type { ReactNode } from 'react';
import { EmptyValue } from '@/components/company-os/cells';
import { cn } from '@/lib/utils';

export type Detail = { label: string; value: ReactNode };

export function DetailList({ details }: { details: Detail[] }) {
    return (
        <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-3 text-sm">
            {details.map((detail) => (
                <div key={detail.label} className="contents">
                    <dt className="text-muted-foreground">{detail.label}</dt>
                    <dd className="text-slate-800">{detail.value ?? <EmptyValue />}</dd>
                </div>
            ))}
        </dl>
    );
}

export function DetailCard({
    title,
    details,
    compact = false,
    action,
}: {
    title: string;
    details: Detail[];
    compact?: boolean;
    action?: ReactNode;
}) {
    return (
        <section className="rounded-lg glass">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
                <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
                {action}
            </div>
            <dl className={cn('grid gap-x-6 gap-y-4 p-5', !compact && 'sm:grid-cols-2')}>
                {details.map((detail) => (
                    <div key={detail.label} className="grid gap-1">
                        <dt className="text-xs text-muted-foreground">{detail.label}</dt>
                        <dd className="text-sm font-medium text-slate-800">{detail.value ?? <EmptyValue />}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
