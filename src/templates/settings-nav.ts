import type { NavGroup } from '@/components/company-os';

export const settingsGroups: NavGroup[] = [
    {
        items: [
            { title: 'Profile', href: '/templates/settings-page' },
            { title: 'Password', href: '/templates/settings/password' },
            { title: 'Security', href: '/templates/settings/security' },
            { title: 'Notifications', href: '/templates/notification-settings' },
        ],
    },
];
