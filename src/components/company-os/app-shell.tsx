import type { ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export function AppShell({
    sidebar,
    header,
    children,
    defaultOpen = true,
    className,
}: {
    sidebar: ReactNode;
    header: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}) {
    return (
        <SidebarProvider defaultOpen={defaultOpen} className={className}>
            {sidebar}
            <SidebarInset className="min-w-0 overflow-x-clip">
                {header}
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
