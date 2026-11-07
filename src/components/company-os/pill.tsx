import { cn } from '@/lib/utils';

export type PillColor = 'slate' | 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber';

const tints: Record<PillColor, string> = {
    slate: 'bg-slate-500/10 text-slate-600',
    indigo: 'bg-indigo-500/10 text-indigo-600',
    cyan: 'bg-cyan-500/10 text-cyan-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
    rose: 'bg-rose-500/10 text-rose-600',
    amber: 'bg-amber-500/10 text-amber-600',
};

const solids: Record<PillColor, string> = {
    slate: 'bg-slate-400',
    indigo: 'bg-indigo-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
};

export function pillTint(color: string): string {
    return tints[color as PillColor] ?? tints.slate;
}

export function pillSolid(color: string): string {
    return solids[color as PillColor] ?? solids.slate;
}

export function Pill({
    name,
    color = 'slate',
    count,
    className,
}: {
    name: string;
    color?: string;
    count?: number;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                pillTint(color),
                className,
            )}
        >
            {count !== undefined && (
                <span className="font-bold tabular-nums">{count}</span>
            )}
            {name}
        </span>
    );
}
