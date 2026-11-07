import type { LucideIcon } from 'lucide-react';
import type { Href } from '@/lib/navigation';
import { toUrl } from '@/lib/navigation';

export type NavItem = {
    title: string;
    href: Href;
    icon?: LucideIcon;
    tour?: string;
    goKey?: string;
};

export type GatedItem = NavItem & {
    permission?: string;
    anyPermission?: string[];
};

export type NavGroup = {
    label?: string;
    items: GatedItem[];
};

export type GoShortcut = {
    key: string;
    title: string;
    url: string;
};

export const canSee = (
    item: Pick<GatedItem, 'permission' | 'anyPermission'>,
    granted: string[],
): boolean =>
    (!item.permission || granted.includes(item.permission)) &&
    (!item.anyPermission ||
        item.anyPermission.some((permission) => granted.includes(permission)));

export const visibleGroups = (groups: NavGroup[], granted: string[]): NavGroup[] =>
    groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => canSee(item, granted)),
        }))
        .filter((group) => group.items.length > 0);

export const permissionsIn = (groups: NavGroup[]): string[] =>
    groups.flatMap((group) =>
        group.items.flatMap((item) => (item.permission ? [item.permission] : [])),
    );

export const goShortcuts = (groups: NavGroup[], granted: string[]): GoShortcut[] =>
    visibleGroups(groups, granted)
        .flatMap((group) => group.items)
        .flatMap((item) =>
            item.goKey ? [{ key: item.goKey, title: item.title, url: toUrl(item.href) }] : [],
        );
