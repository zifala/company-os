import { HouseIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { visibleGroups } from '@/components/company-os/nav';
import type { NavGroup } from '@/components/company-os/nav';
import { toUrl } from '@/lib/navigation';

export type PaletteItem = {
    label: string;
    icon: LucideIcon;
    shortcut?: string;
    permission?: string;
    anyPermission?: string[];
    run: string | (() => void);
};

export type FoundGroup = {
    name: string;
    items: { id: string; label: string; url: string }[];
};

export type PaletteLabels = {
    title: string;
    actions: string;
    goTo: string;
    failed: string;
    empty: string;
};

export const paletteLabels: PaletteLabels = {
    title: 'Command palette',
    actions: 'Actions',
    goTo: 'Go to',
    failed: 'Search failed. Check your connection and type again.',
    empty: 'No records or commands match',
};

export const goItems = (groups: NavGroup[], permissions: string[]): PaletteItem[] =>
    visibleGroups(groups, permissions)
        .flatMap((group) => group.items)
        .map((item) => ({
            label: item.title,
            icon: item.icon ?? HouseIcon,
            shortcut: item.goKey ? `G ${item.goKey.toUpperCase()}` : undefined,
            run: toUrl(item.href),
        }));

export const matchesTerm = (items: PaletteItem[], term: string): PaletteItem[] =>
    items.filter((item) => item.label.toLowerCase().includes(term));
