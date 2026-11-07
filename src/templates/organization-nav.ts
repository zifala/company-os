import { BotIcon, PlugIcon, Settings2Icon, ShieldCheckIcon, UsersIcon } from 'lucide-react';
import type { NavGroup } from '@/components/company-os';

export const organizationGroups: NavGroup[] = [
    {
        label: 'People',
        items: [
            { title: 'Users', href: '/templates/users-page', icon: UsersIcon, permission: 'users.view-any' },
            { title: 'Roles', href: '/templates/roles', icon: ShieldCheckIcon, permission: 'roles.manage' },
        ],
    },
    {
        label: 'System',
        items: [
            { title: 'Workspace', href: '/templates/workspace', icon: Settings2Icon, permission: 'settings.manage' },
            { title: 'Setup', href: '/templates/setup-page', icon: Settings2Icon, permission: 'settings.manage' },
            { title: 'AI agents', href: '/templates/agents', icon: BotIcon, permission: 'agents.manage' },
            { title: 'Integrations', href: '/templates/integrations', icon: PlugIcon, permission: 'integrations.manage' },
        ],
    },
];

export const adminPermissions = ['users.view-any', 'roles.manage', 'settings.manage', 'agents.manage', 'integrations.manage'];
