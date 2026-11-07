import { ChevronsUpDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { UserInfo } from '@/components/company-os/user-info';
import type { UserSummary } from '@/components/company-os/user-info';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export type UserMenuItem = {
    label: string;
    icon?: LucideIcon;
    href?: Href;
    onSelect?: () => void;
};

function MenuEntry({ item }: { item: UserMenuItem }) {
    if (item.href) {
        return (
            <DropdownMenuItem asChild>
                <Link className="block w-full cursor-pointer" href={item.href} onClick={item.onSelect}>
                    {item.icon && <item.icon className="mr-2" />}
                    {item.label}
                </Link>
            </DropdownMenuItem>
        );
    }

    return (
        <DropdownMenuItem onSelect={item.onSelect}>
            {item.icon && <item.icon className="mr-2" />}
            {item.label}
        </DropdownMenuItem>
    );
}

export function NavUser({
    user,
    items,
    logout,
}: {
    user: UserSummary;
    items: UserMenuItem[];
    logout: UserMenuItem;
}) {
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                        >
                            <UserInfo user={user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserInfo user={user} showEmail />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {items.map((item) => (
                                <MenuEntry key={item.label} item={item} />
                            ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <MenuEntry item={logout} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
