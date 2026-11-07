import type { ReactNode } from 'react';

export function PageHeader({
    title,
    meta,
    children,
}: {
    title: string;
    meta?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <div className="flex min-h-9 flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
                <h1 className="truncate text-xl font-semibold text-slate-800">
                    {title}
                </h1>
                {meta}
            </div>
            {children && (
                <div className="flex flex-wrap items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}
