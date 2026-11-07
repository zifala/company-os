import type { ComponentProps, ReactNode } from 'react';
import { visibleGroups } from '@/components/company-os/nav';
import type { NavGroup } from '@/components/company-os/nav';
import { NavFavorites, NavMain } from '@/components/company-os/nav-main';
import type { Favorite } from '@/components/company-os/nav-main';
import { useActiveNavHref } from '@/components/company-os/use-active-nav-href';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, toUrl } from '@/lib/navigation';
import type { Href } from '@/lib/navigation';

export function AppSidebar({
    logo,
    homeHref,
    groups,
    permissions,
    favorites = [],
    create,
    footer,
    collapsible = 'icon',
    variant = 'inset',
}: {
    logo: ReactNode;
    homeHref: Href;
    groups: NavGroup[];
    permissions: string[];
    favorites?: Favorite[];
    create?: ReactNode;
    footer?: ReactNode;
    collapsible?: ComponentProps<typeof Sidebar>['collapsible'];
    variant?: ComponentProps<typeof Sidebar>['variant'];
}) {
    const visible = visibleGroups(groups, permissions);
    const activeHref = useActiveNavHref([
        ...favorites.map((favorite) => toUrl(favorite.href)),
        ...visible.flatMap((group) => group.items.map((item) => toUrl(item.href))),
    ]);

    return (
        <Sidebar collapsible={collapsible} variant={variant} data-tour="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                {logo}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {create}
            </SidebarHeader>

            <SidebarContent>
                <NavFavorites favorites={favorites} activeHref={activeHref} />
                {visible.map((group, index) => (
                    <NavMain
                        key={group.label ?? index}
                        label={group.label}
                        items={group.items}
                        activeHref={activeHref}
                    />
                ))}
            </SidebarContent>

            {footer && <SidebarFooter>{footer}</SidebarFooter>}
        </Sidebar>
    );
}

export function AppLogo({ icon, name }: { icon: ReactNode; name: string }) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center text-primary">
                {icon}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-800">
                    {name}
                </span>
            </div>
        </>
    );
}
