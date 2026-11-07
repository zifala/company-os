import { CheckIcon, MinusIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Pill } from '@/components/company-os/pill';
import { TableCell } from '@/components/ui/table';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export type Money = { formatted: string; currency: string } | null;
export type Day = { label: string; relative: string } | null;
export type Status = { label: string; color: string };
export type Person = { name: string; detail?: string | null } | null;
export type Flag = { value: boolean; label: string };
export type Target = { label: string; href: Href; detail?: string | null };

export function EmptyValue() {
    return <span className="text-muted-foreground">—</span>;
}

function Stacked({ main, detail }: { main: ReactNode; detail?: string | null }) {
    return (
        <span className="grid min-w-0 gap-0.5">
            <span className="truncate">{main}</span>
            {detail && <span className="truncate text-xs text-muted-foreground">{detail}</span>}
        </span>
    );
}

export function MoneyCell({ value, strong = true }: { value: Money; strong?: boolean }) {
    return (
        <TableCell className={cn('text-right tabular-nums', strong && 'font-bold text-slate-800')}>
            {value ? (
                <>
                    <span className="mr-1 text-xs font-light text-muted-foreground">{value.currency}</span>
                    {value.formatted}
                </>
            ) : (
                <EmptyValue />
            )}
        </TableCell>
    );
}

export function NumberCell({ value, unit }: { value: string | null; unit?: string }) {
    return (
        <TableCell className="text-right tabular-nums">
            {value ?? <EmptyValue />}
            {value !== null && unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
        </TableCell>
    );
}

export function DateCell({ value }: { value: Day }) {
    return (
        <TableCell className="text-sm tabular-nums" title={value?.relative}>
            {value?.label ?? <EmptyValue />}
        </TableCell>
    );
}

export function StatusCell({ value, detail }: { value: Status | null; detail?: string | null }) {
    return (
        <TableCell>
            {value ? <Stacked main={<Pill name={value.label} color={value.color} />} detail={detail} /> : <EmptyValue />}
        </TableCell>
    );
}

export function PersonCell({ value }: { value: Person }) {
    return <TableCell>{value ? <Stacked main={value.name} detail={value.detail} /> : <EmptyValue />}</TableCell>;
}

export function CodeCell({ value }: { value: string | null }) {
    return (
        <TableCell className="font-mono text-xs text-muted-foreground">{value ?? <EmptyValue />}</TableCell>
    );
}

export function BooleanCell({ value }: { value: Flag }) {
    const Icon = value.value ? CheckIcon : MinusIcon;

    return (
        <TableCell>
            <span className="inline-flex items-center gap-1.5">
                <Icon className={cn('size-4', value.value ? 'text-emerald-600' : 'text-slate-400')} />
                {value.label}
            </span>
        </TableCell>
    );
}

export function LinkCell({ value }: { value: Target }) {
    return (
        <TableCell className="font-semibold text-slate-800">
            <Stacked
                main={
                    <Link href={value.href} className="transition-all duration-300 hover:text-primary">
                        {value.label}
                    </Link>
                }
                detail={value.detail}
            />
        </TableCell>
    );
}

export function TextCell({ children, detail }: { children: ReactNode; detail?: string | null }) {
    return <TableCell className="text-sm">{children ? <Stacked main={children} detail={detail} /> : <EmptyValue />}</TableCell>;
}
