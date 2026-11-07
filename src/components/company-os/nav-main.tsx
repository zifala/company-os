import { BookmarkIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavItem } from '@/components/company-os/nav';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, toUrl } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export type Favorite = {
    id: string;
    title: string;
    href: Href;
    icon?: LucideIcon;
};

export function NavMain({
    label,
    items,
    activeHref,
}: {
    label?: string;
    items: NavItem[];
    activeHref: string | null;
}) {
    return (
        <SidebarGroup className="px-2 py-0">
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title} data-tour={item.tour}>
                        <SidebarMenuButton
                            asChild
                            isActive={toUrl(item.href) === activeHref}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function NavFavorites({
    favorites,
    activeHref,
    label = 'Favorites',
}: {
    favorites: Favorite[];
    activeHref: string | null;
    label?: string;
}) {
    if (favorites.length === 0) {
        return null;
    }

    return (
        <NavMain
            label={label}
            activeHref={activeHref}
            items={favorites.map((favorite) => ({
                title: favorite.title,
                href: favorite.href,
                icon: favorite.icon ?? BookmarkIcon,
            }))}
        />
    );
}
