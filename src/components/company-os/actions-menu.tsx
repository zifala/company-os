import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ActionsMenuItem = {
    label: string;
    onSelect: () => void;
    destructive?: boolean;
};

export function ActionsMenu({
    items,
    label = 'More actions',
}: {
    items: ActionsMenuItem[];
    label?: string;
}) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="size-8 rounded-md" aria-label={label}>
                    <MoreHorizontalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items.map((item) => (
                    <DropdownMenuItem
                        key={item.label}
                        variant={item.destructive ? 'destructive' : 'default'}
                        onSelect={item.onSelect}
                    >
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
