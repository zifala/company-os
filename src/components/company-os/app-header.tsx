import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader({ children }: { children?: ReactNode }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">{children}</div>
        </header>
    );
}

export function SearchButton({
    onClick,
    label = 'Search',
    shortcut = '⌘K',
}: {
    onClick: () => void;
    label?: string;
    shortcut?: string;
}) {
    return (
        <Button
            variant="outline"
            size="sm"
            className="w-56 justify-start text-muted-foreground"
            data-tour="search"
            onClick={onClick}
        >
            <SearchIcon className="size-4" />
            {label}
            <Kbd className="ml-auto">{shortcut}</Kbd>
        </Button>
    );
}
