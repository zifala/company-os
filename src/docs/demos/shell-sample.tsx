import {
    BuildingIcon,
    ContactIcon,
    FolderKanbanIcon,
    HandshakeIcon,
    HouseIcon,
    InboxIcon,
    KeyboardIcon,
    NetworkIcon,
    ReceiptIcon,
    ShieldCheckIcon,
    SlidersHorizontalIcon,
    Trash2Icon,
    UserPlusIcon,
    UsersIcon,
} from 'lucide-react';
import type { FoundGroup, NavGroup, NotificationData, PaletteItem, QuickCreateItem, UserSummary } from '@/components/company-os';

export const navGroups: NavGroup[] = [
    {
        label: 'Daily',
        items: [
            { title: 'Home', href: '/dashboard', icon: HouseIcon, goKey: 'h', tour: 'home' },
            { title: 'Inbox', href: '/inbox', icon: InboxIcon, goKey: 'i' },
        ],
    },
    {
        label: 'Clients',
        items: [
            { title: 'Contacts', href: '/contacts', icon: ContactIcon, permission: 'contacts.view-any', goKey: 'c' },
            { title: 'Deals', href: '/deals', icon: HandshakeIcon, permission: 'deals.view-any', goKey: 'd' },
        ],
    },
    {
        label: 'Work',
        items: [
            { title: 'Projects', href: '/projects', icon: FolderKanbanIcon, goKey: 'p', tour: 'projects' },
            { title: 'Invoices', href: '/invoices', icon: ReceiptIcon, permission: 'invoices.view-any', goKey: 'v' },
        ],
    },
    {
        label: 'Manage',
        items: [
            { title: 'Setup', href: '/setup', icon: SlidersHorizontalIcon, permission: 'settings.manage' },
            { title: 'Organization', href: '/organization', icon: NetworkIcon, anyPermission: ['users.view-any', 'roles.manage'] },
            { title: 'Trash', href: '/trash', icon: Trash2Icon },
        ],
    },
];

export const organizationGroups: NavGroup[] = [
    {
        label: 'People',
        items: [
            { title: 'Users', href: '/organization/users', icon: UsersIcon, permission: 'users.view-any' },
            { title: 'Roles', href: '/organization/roles', icon: ShieldCheckIcon, permission: 'roles.manage' },
        ],
    },
    {
        label: 'System',
        items: [{ title: 'Workspace', href: '/organization/workspace', icon: BuildingIcon, permission: 'settings.manage' }],
    },
];

export const managerPermissions = ['contacts.view-any', 'deals.view-any', 'invoices.view-any', 'settings.manage', 'users.view-any', 'roles.manage'];

export const memberPermissions = ['contacts.view-any'];

export const user: UserSummary = { name: 'Hodan Ali', email: 'hodan@northwind.example' };

export const paletteActions = (onHelp: () => void): PaletteItem[] => [
    { label: 'Create contact', icon: UserPlusIcon, permission: 'contacts.create', run: '/contacts/create' },
    { label: 'Create deal', icon: HandshakeIcon, permission: 'deals.create', run: '/deals/create' },
    { label: 'Show keyboard shortcuts', icon: KeyboardIcon, shortcut: '?', run: onHelp },
];

export const quickCreateItems = (onPick: (kind: string) => void): QuickCreateItem[] => [
    { kind: 'contact', label: 'Contact', icon: ContactIcon, shortcut: 'C', onSelect: () => onPick('contact') },
    { kind: 'deal', label: 'Deal', icon: HandshakeIcon, onSelect: () => onPick('deal') },
    { kind: 'project', label: 'Project', icon: FolderKanbanIcon, onSelect: () => onPick('project') },
];

const foundGroups: FoundGroup[] = [
    {
        name: 'Contacts',
        items: [
            { id: 'c-1', label: 'Halcyon Freight · Ayaan Warsame', url: '/contacts/1' },
            { id: 'c-2', label: 'Northwind Trading · Mahad Yusuf', url: '/contacts/2' },
        ],
    },
    {
        name: 'Projects',
        items: [{ id: 'p-1', label: 'Harbour terminal rollout', url: '/projects/1' }],
    },
];

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const fakeSearch = async (term: string): Promise<FoundGroup[]> => {
    await wait(300);

    return foundGroups
        .map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLowerCase().includes(term.toLowerCase())) }))
        .filter((group) => group.items.length > 0);
};

export const fakeNotifications = async (): Promise<NotificationData> => {
    await wait(300);

    return {
        waiting: [
            { key: 'approvals', label: 'Invoices to approve', count: 2, href: '/invoices?status=submitted' },
            { key: 'onboardings', label: 'Onboardings to review', count: 1, href: '/onboardings?stage=review' },
        ],
        recent: [
            { id: 'n-1', message: 'Ayaan Warsame assigned you INV-0411', url: '/invoices/2', read: false, at_label: '12 minutes ago' },
            { id: 'n-2', message: 'Mahad Yusuf mentioned you on Harbour terminal rollout', url: '/projects/1', read: false, at_label: '1 hour ago' },
            { id: 'n-3', message: 'Kestrel Logistics moved to Won', url: '/deals/3', read: true, at_label: 'Yesterday' },
        ],
    };
};
