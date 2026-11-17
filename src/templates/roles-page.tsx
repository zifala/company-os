import { useState } from 'react';
import { DetailCard, FieldRow, FormLayout, FormSection, PermissionPicker, SectionLayout, SensitiveSwitches } from '@/components/company-os';
import type { PermissionGrant, PermissionGroup, SensitiveSwitch } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { adminPermissions, organizationGroups } from './organization-nav';

const groups: PermissionGroup[] = [
    {
        key: 'contacts',
        label: 'Contacts',
        permissions: [
            { name: 'contacts.view', label: 'View contacts', scoped: true },
            { name: 'contacts.create', label: 'Create contacts' },
            { name: 'contacts.update', label: 'Update contacts', scoped: true },
            { name: 'contacts.delete', label: 'Delete contacts', scoped: true },
        ],
    },
    {
        key: 'deals',
        label: 'Deals',
        permissions: [
            { name: 'deals.view', label: 'View deals', scoped: true },
            { name: 'deals.update', label: 'Update deals', scoped: true },
            { name: 'deals.close', label: 'Close won or lost', scoped: true },
        ],
    },
    {
        key: 'finance',
        label: 'Finance',
        permissions: [
            { name: 'invoices.view', label: 'View invoices', scoped: true },
            { name: 'invoices.issue', label: 'Issue invoices' },
            { name: 'invoices.void', label: 'Void invoices' },
        ],
    },
];

const scopes = [
    { value: 'firm', label: 'Whole firm' },
    { value: 'department', label: 'Own department' },
    { value: 'assigned', label: 'Assigned to them' },
    { value: 'own', label: 'Created by them' },
];

const switches: SensitiveSwitch[] = [
    { key: 'money', label: 'Money', hint: 'Amounts on deals, invoices and payments.' },
    { key: 'cost_and_margin', label: 'Cost and margin', hint: 'Unit cost, margin and supplier prices.' },
    { key: 'salaries', label: 'Salaries', hint: 'Pay, allowances and payroll runs.' },
    { key: 'client_contacts', label: 'Client contacts', hint: 'Phone numbers and email addresses of client people.' },
];

const held = new Set(['contacts.view', 'contacts.create', 'contacts.update', 'contacts.delete', 'deals.view', 'deals.update', 'deals.close', 'invoices.view', 'money', 'client_contacts']);

export function RolesPage() {
    const [name, setName] = useState('Sales manager');
    const [grants, setGrants] = useState<PermissionGrant[]>([
        { name: 'contacts.view', scope: 'firm' },
        { name: 'contacts.create', scope: null },
        { name: 'contacts.update', scope: 'department' },
        { name: 'deals.view', scope: 'department' },
        { name: 'deals.update', scope: 'assigned' },
        { name: 'invoices.view', scope: 'department' },
    ]);
    const [sensitive, setSensitive] = useState<string[]>(['money', 'client_contacts']);

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <FormLayout
                title="Edit role"
                actions={
                    <>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save role</Button>
                    </>
                }
                side={
                    <DetailCard
                        compact
                        title="In use"
                        details={[
                            { label: 'Users', value: '3' },
                            { label: 'Last changed', value: '2 Nov 2026 by Ayaan Warsame' },
                            { label: 'Saving asks for', value: 'Your password' },
                        ]}
                    />
                }
            >
                <FormSection title="Role" compact>
                    <FieldRow id="role-name" label="Name">
                        <Input id="role-name" value={name} onChange={(event) => setName(event.target.value)} />
                    </FieldRow>
                    <FieldRow id="role-description" label="Description" hint="Shown in the role picker when someone invites a user.">
                        <Textarea id="role-description" defaultValue="Runs the sales team: contacts across the firm, deals in their department." />
                    </FieldRow>
                </FormSection>
                <PermissionPicker groups={groups} value={grants} onChange={setGrants} scopes={scopes} holds={(permission) => held.has(permission)} />
                <SensitiveSwitches switches={switches} value={sensitive} onChange={setSensitive} holds={(key) => held.has(key)} />
            </FormLayout>
        </SectionLayout>
    );
}
