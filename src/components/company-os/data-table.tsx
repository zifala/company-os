import type { ReactNode } from 'react';
import { Pager } from '@/components/company-os/pager';
import type { PagerLabels } from '@/components/company-os/pager';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export type Paginated<T> = {
    data: T[];
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type PageLabels = PagerLabels & {
    showing: (from: number, to: number, total: number) => string;
    none: string;
};

const defaultLabels: PageLabels = {
    previous: 'Previous page',
    next: 'Next page',
    showing: (from, to, total) => `Showing ${from}–${to} of ${total}`,
    none: '0 results',
};

export function DataTable({
    page,
    labels = defaultLabels,
    children,
}: {
    page?: Paginated<unknown>;
    labels?: PageLabels;
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col rounded-lg glass">
            <div className="min-h-0 flex-1 overflow-auto [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-card/90 [&_thead]:backdrop-blur-sm">
                {children}
            </div>
            {page && (
                <div className="flex items-center justify-between gap-4 border-t border-border px-3 py-2 text-sm text-muted-foreground">
                    <span className="tabular-nums">
                        {page.total === 0 || page.from === null || page.to === null
                            ? labels.none
                            : labels.showing(page.from, page.to, page.total)}
                    </span>
                    <Pager prev={page.prev_page_url} next={page.next_page_url} labels={labels} />
                </div>
            )}
        </div>
    );
}

export function TableEmptyRow({
    colSpan,
    title,
    message,
    children,
}: {
    colSpan: number;
    title: string;
    message?: string;
    children?: ReactNode;
}) {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="h-40 text-center">
                <div className="grid justify-items-center gap-2">
                    <p className="font-medium text-slate-800">{title}</p>
                    {message && <p className="max-w-md text-sm text-muted-foreground">{message}</p>}
                    {children}
                </div>
            </TableCell>
        </TableRow>
    );
}

export function DataTableSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="rounded-lg glass">
            <div className="h-10 border-b border-border" />
            {Array.from({ length: rows }, (_, index) => (
                <div key={index} className="flex h-11 items-center border-b border-border px-3 last:border-0">
                    <Skeleton className="h-4 w-full rounded-md" />
                </div>
            ))}
        </div>
    );
}
