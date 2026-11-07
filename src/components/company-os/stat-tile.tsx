import type { ReactNode } from 'react';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function StatTile({
    label,
    value,
    unit,
    hint,
    href,
    raised = false,
}: {
    label: string;
    value: ReactNode;
    unit?: string;
    hint?: string;
    href?: Href;
    raised?: boolean;
}) {
    const className = cn(
        'block rounded-lg px-4 py-3',
        raised ? 'glass shadow-sm' : 'bg-slate-900/5',
        href && 'transition-all duration-300 hover:bg-primary/5',
    );
    const body = (
        <>
            <p className="text-xl font-bold text-slate-800 tabular-nums">
                {value}
                {unit && <span className="ml-1 text-sm font-light text-muted-foreground">{unit}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </>
    );

    return href ? (
        <Link href={href} className={className}>
            {body}
        </Link>
    ) : (
        <div className={className}>{body}</div>
    );
}
