import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
    icon: Icon,
    title,
    message,
    children,
}: {
    icon: LucideIcon;
    title: string;
    message: string;
    children?: ReactNode;
}) {
    return (
        <div className="flex min-h-76 flex-col items-center justify-center gap-3 rounded-lg glass px-6 py-10 text-center shadow-sm">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
            </span>
            <div className="grid max-w-md gap-1">
                <p className="font-medium text-slate-800">{title}</p>
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            {children}
        </div>
    );
}
