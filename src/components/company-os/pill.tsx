import { cn } from '@/lib/utils';

export type PillColor = 'slate' | 'indigo' | 'cyan' | 'emerald' | 'rose' | 'amber';

// Each server colour name maps to a semantic token: slate → muted-foreground, indigo → primary, cyan → info,
// emerald → success, rose → destructive, amber → warning. The text deepens the token toward the ink so it reads on its tint.
const tints: Record<PillColor, string> = {
    slate: 'bg-muted-foreground/10 text-[color-mix(in_oklab,var(--color-muted-foreground)_60%,var(--color-foreground))]',
    indigo: 'bg-primary/10 text-[color-mix(in_oklab,var(--color-primary)_60%,var(--color-foreground))]',
    cyan: 'bg-info/10 text-[color-mix(in_oklab,var(--color-info)_60%,var(--color-foreground))]',
    emerald: 'bg-success/10 text-[color-mix(in_oklab,var(--color-success)_60%,var(--color-foreground))]',
    rose: 'bg-destructive/10 text-[color-mix(in_oklab,var(--color-destructive)_60%,var(--color-foreground))]',
    amber: 'bg-warning/10 text-[color-mix(in_oklab,var(--color-warning)_60%,var(--color-foreground))]',
};

const solids: Record<PillColor, string> = {
    slate: 'bg-muted-foreground/60',
    indigo: 'bg-primary',
    cyan: 'bg-info',
    emerald: 'bg-success',
    rose: 'bg-destructive',
    amber: 'bg-warning',
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
