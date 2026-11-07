import { PlusIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useControllableOpen } from '@/hooks/use-controllable-open';

export type QuickCreateItem = {
    kind: string;
    label: string;
    icon: LucideIcon;
    shortcut?: string;
    onSelect: () => void;
};

export function QuickCreate({
    items,
    label = 'New',
    open: controlledOpen,
    onOpenChange,
}: {
    items: QuickCreateItem[];
    label?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);

    if (items.length === 0) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem data-tour="quick-create">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            tooltip={label}
                            className="bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 hover:text-primary-foreground data-[state=open]:bg-primary/90 data-[state=open]:text-primary-foreground"
                        >
                            <PlusIcon />
                            <span>{label}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        {items.map((item) => (
                            <DropdownMenuItem key={item.kind} onSelect={item.onSelect}>
                                <item.icon />
                                {item.label}
                                {item.shortcut && (
                                    <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
