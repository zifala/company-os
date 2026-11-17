import type { ComponentType } from 'react';
import { useState } from 'react';
import { PermissionPicker, PreferenceMatrix, SensitiveSwitches } from '@/components/company-os';
import type { PermissionGrant, PermissionGroup, PreferenceValue } from '@/components/company-os';

const groups: PermissionGroup[] = [
    {
        key: 'contacts',
        label: 'Contacts',
        permissions: [
            { name: 'contacts.view', label: 'View contacts', scoped: true },
            { name: 'contacts.create', label: 'Create contacts' },
            { name: 'contacts.update', label: 'Update contacts', scoped: true },
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

const held = new Set(['contacts.view', 'contacts.create', 'contacts.update', 'invoices.view', 'money', 'client_contacts']);

function PermissionPickerDemo() {
    const [value, setValue] = useState<PermissionGrant[]>([
        { name: 'contacts.view', scope: 'firm' },
        { name: 'contacts.update', scope: 'assigned' },
        { name: 'invoices.view', scope: 'department' },
    ]);

    return (
        <div className="max-w-2xl">
            <PermissionPicker groups={groups} value={value} onChange={setValue} scopes={scopes} holds={(name) => held.has(name)} />
        </div>
    );
}

function SensitiveSwitchesDemo() {
    const [value, setValue] = useState(['money']);

    return (
        <div className="max-w-2xl">
            <SensitiveSwitches
                switches={[
                    { key: 'money', label: 'Money', hint: 'Amounts on deals, invoices and payments.' },
                    { key: 'cost_and_margin', label: 'Cost and margin', hint: 'Unit cost, margin and supplier prices.' },
                    { key: 'salaries', label: 'Salaries', hint: 'Pay, allowances and payroll runs.' },
                    { key: 'client_contacts', label: 'Client contacts', hint: 'Phone numbers and email addresses of client people.' },
                ]}
                value={value}
                onChange={setValue}
                holds={(key) => held.has(key)}
            />
        </div>
    );
}

function PreferenceMatrixDemo() {
    const [value, setValue] = useState<PreferenceValue>({
        task_assigned: { in_app: true, email: true },
        task_commented: { in_app: true },
        mentioned: { in_app: true, email: true },
        managed_deals_activity: {},
        invoice_due_reminder: { in_app: true, email: true },
    });

    return (
        <div className="max-w-2xl">
            <PreferenceMatrix
                events={[
                    { key: 'task_assigned', label: 'A task is assigned to you', group: 'Tasks' },
                    { key: 'task_commented', label: 'Someone comments on your task', group: 'Tasks' },
                    { key: 'mentioned', label: 'Someone mentions you', hint: 'Replaces the comment notification for that comment.', group: 'Tasks' },
                    { key: 'managed_deals_activity', label: 'Activity on deals in your department', hint: 'Off until you turn it on.', group: 'Deals' },
                    { key: 'invoice_due_reminder', label: 'An invoice you own falls due', group: 'Reminders' },
                ]}
                channels={[
                    { key: 'in_app', label: 'In-app' },
                    { key: 'email', label: 'Email' },
                    { key: 'whatsapp', label: 'WhatsApp', available: false, unavailableHint: 'Add a phone number on your profile first.' },
                ]}
                value={value}
                onChange={setValue}
            />
        </div>
    );
}

export const accessDemos: Record<string, ComponentType> = {
    'permission-picker-basic': PermissionPickerDemo,
    'sensitive-switches-basic': SensitiveSwitchesDemo,
    'preference-matrix-basic': PreferenceMatrixDemo,
};
