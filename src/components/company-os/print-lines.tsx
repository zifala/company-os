import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type PrintColumn = { key: string; label: string; numeric?: boolean; width?: string };

export type PrintRow = { id: string; cells: Record<string, string> };

export type PrintTotal = { label: string; value: string; strong?: boolean };

export function PrintLines({ columns, rows }: { columns: PrintColumn[]; rows: PrintRow[] }) {
    return (
        <table className="w-full border-collapse text-[9.5pt]">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} scope="col" style={{ width: column.width }} className={cn('border-b border-black px-[1mm] py-[2mm] text-left font-semibold', column.numeric && 'text-right')}>
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.id} className="break-inside-avoid">
                        {columns.map((column) => (
                            <td key={column.key} className={cn('border-b border-neutral-300 px-[1mm] py-[2mm] align-top', column.numeric && 'text-right tabular-nums')}>
                                {row.cells[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function PrintTotals({ totals }: { totals: PrintTotal[] }) {
    return (
        <dl className="ml-auto grid w-[70mm] break-inside-avoid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[9.5pt]">
            {totals.map((total) => (
                <div key={total.label} className={cn('col-span-2 grid grid-cols-subgrid', total.strong && 'border-t border-black pt-[1.5mm] font-semibold')}>
                    <dt>{total.label}</dt>
                    <dd className="text-right tabular-nums">{total.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export function PrintBlock({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="break-inside-avoid">
            <h2 className="mb-[1.5mm] text-[8.5pt] font-semibold tracking-wide text-neutral-600 uppercase">{title}</h2>
            <div className="text-[9.5pt]">{children}</div>
        </section>
    );
}
