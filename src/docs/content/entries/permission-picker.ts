import type { DocEntry } from '../types';

export const permissionPicker: DocEntry = {
    slug: 'permission-picker',
    name: 'PermissionPicker',
    category: 'access',
    pieces: [4, 5],
    tagline: 'Permissions grouped by module, a scope beside each scoped one, and a lock on what the editor does not hold.',
    job: 'Build a role in the UI without letting anyone grant beyond their own reach.',
    tags: ['permissions', 'roles', 'scope', 'access', 'grant', 'checkbox'],
    exports: ['PermissionPicker', 'permissionPickerLabels', 'PermissionGrant', 'PermissionGroup', 'PermissionOption', 'PermissionPickerLabels', 'ScopeOption'],
    files: ['components/company-os/permission-picker.tsx'],
    shadcnDeps: ['checkbox', 'select'],
    intro: [
        'Groups come from the permission registry in <code>config/permissions.php</code>, labels from lang. Each group card has a select-all checkbox that turns indeterminate on a partial pick and a count. A permission marked <code>scoped</code> shows its scope select once ticked: firm, department, assigned, own.',
        '<code>holds(name)</code> answers whether the editor holds a permission. One they do not hold is locked unless the role already has it, so a partial holder can still rename the role or drop permissions. The server guard (<code>AccessGuards::grantable</code>) is the real check; the lock is the honest UI.',
    ],
    examples: [
        {
            title: 'Role form',
            description: 'Invoices issue and void are locked: the editor does not hold them.',
            demoKey: 'permission-picker-basic',
            code: `import { PermissionPicker } from '@/components/company-os';
import { useForm } from '@inertiajs/react';

const form = useForm({ name: role.name, permissions: role.permissions });

<PermissionPicker
  groups={groups}
  scopes={scopes}
  value={form.data.permissions}
  onChange={(permissions) => form.setData('permissions', permissions)}
  holds={(name) => auth.permissions.includes(name)}
  disabled={role.is_super_admin}
/>`,
        },
    ],
    props: [
        {
            component: 'PermissionPicker',
            rows: [
                { name: 'groups', type: 'PermissionGroup[]', description: '<code>{ key, label, permissions: { name, label, scoped? }[] }</code>, in registry order.' },
                { name: 'value · onChange', type: 'PermissionGrant[]', description: '<code>{ name, scope }</code>. <code>scope</code> is <code>null</code> for unscoped permissions.' },
                { name: 'scopes', type: 'ScopeOption[]', description: 'The scope choices; the first is the default on tick.' },
                { name: 'holds', type: '(name: string) => boolean', description: 'Whether the editor holds this permission.' },
                { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Locks everything. The super admin role.' },
                { name: 'labels', type: 'PermissionPickerLabels', description: 'selectAll, scope, notHeld, selected(count, total).' },
            ],
        },
    ],
    a11y: {
        keyboard: [{ keys: 'Space', action: 'Toggle the focused permission or group' }],
        notes: ['Each checkbox has a real label; the scope select is labelled with the permission name.', 'The lock icon carries the reason as its label.'],
    },
    donts: ['No grant of a permission the editor does not hold.', 'No editing the super admin role. It passes everything through Gate::before.', 'No hiding sidebar items as access control. The server decides; the picker only builds the role.'],
    faq: [{ q: 'Where do labels come from?', a: 'The registry keys map to lang lines. The page passes them translated; the component prints strings.' }],
};
