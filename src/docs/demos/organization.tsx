import type { ComponentType } from 'react';
import { useState } from 'react';
import { AuditLogTable, LetterheadPreview, SecretReveal, ServiceStatusList, WebhookEventPicker } from '@/components/company-os';
import type { AuditEvent, Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { webhookGroups } from '@/templates/webhook-catalogue';
import { organizationDemos2 } from './organization-2';

const events: AuditEvent[] = [
    { id: '1', at: { label: '17 Nov 2026, 09:41', relative: '6 minutes ago' }, actor: { name: 'Hodan Ali' }, event: { name: 'deal.lost', label: 'Deal lost' }, subject: { label: 'Cold chain audit', href: '#', detail: 'Deal · Kestrel Logistics' }, via: null, reason: 'Client chose an in-house team after the pilot.' },
    { id: '2', at: { label: '17 Nov 2026, 09:12', relative: '35 minutes ago' }, actor: { name: 'Mahad Yusuf' }, event: { name: 'task.updated', label: 'Task updated' }, subject: { label: 'ZW-142 Harbour terminal rollout', href: '#', detail: 'Task' }, via: 'via automation “Overdue chaser”', reason: null },
    { id: '3', at: { label: '17 Nov 2026, 03:00', relative: '7 hours ago' }, actor: null, event: { name: 'webhook_endpoint.disabled', label: 'Webhook endpoint turned off' }, subject: { label: 'hooks.ledgerline.example/in', href: '#', detail: 'Webhook endpoint' }, via: null, reason: 'Every delivery failed for 3 days.' },
];

const page = (total: number): Paginated<unknown> => ({ data: [], from: total ? 1 : null, to: total || null, total, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null });

function AuditLogTableDemo() {
    return <AuditLogTable page={page(3)} events={events} />;
}

function AuditLogTableEmptyDemo() {
    return (
        <AuditLogTable
            page={page(0)}
            events={[]}
            empty={
                <Button size="sm" variant="outline">
                    Clear filters
                </Button>
            }
        />
    );
}

function ServiceStatusListDemo() {
    return (
        <div className="max-w-md">
            <ServiceStatusList
                services={[
                    { key: 'mail', label: 'Mail', ok: true, env: ['MAIL_MAILER', 'MAIL_HOST', 'MAIL_FROM_ADDRESS'] },
                    { key: 'queue', label: 'Queue', ok: true, env: ['QUEUE_CONNECTION'] },
                    { key: 'whatsapp', label: 'WhatsApp', ok: false, env: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'] },
                ]}
            />
        </div>
    );
}

function LetterheadPreviewDemo() {
    return (
        <div className="max-w-sm">
            <LetterheadPreview
                letterhead={{
                    legalName: 'Halcyon Trading Company Ltd',
                    lines: ['KM4, Maka Al Mukarama Road', 'Mogadishu, Somalia', 'Reg. no. SO-2019-04417 · TIN 300-118-552'],
                    logo: <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">HT</span>,
                }}
            />
        </div>
    );
}

function SecretRevealDemo() {
    return (
        <div className="max-w-xl">
            <SecretReveal label="Signing secret" value="whsec_Q8n2vT7mKc4LxR1pZ9aW3eY6uB0sJ5hD2fG8kN4q" />
        </div>
    );
}

function WebhookEventPickerDemo() {
    const [value, setValue] = useState(['deal.won', 'deal.lost', 'invoice.paid']);

    return (
        <div className="max-w-xl">
            <WebhookEventPicker groups={webhookGroups} value={value} onChange={setValue} />
        </div>
    );
}

function WebhookEventPickerDisabledDemo() {
    return (
        <div className="max-w-xl">
            <WebhookEventPicker groups={webhookGroups} value={['deal.won', 'invoice.paid']} onChange={() => undefined} disabled />
        </div>
    );
}

export const organizationDemos: Record<string, ComponentType> = {
    'audit-log-table-basic': AuditLogTableDemo,
    'audit-log-table-empty': AuditLogTableEmptyDemo,
    'service-status-list-basic': ServiceStatusListDemo,
    'letterhead-preview-basic': LetterheadPreviewDemo,
    'secret-reveal-basic': SecretRevealDemo,
    'webhook-event-picker-basic': WebhookEventPickerDemo,
    'webhook-event-picker-disabled': WebhookEventPickerDisabledDemo,
    ...organizationDemos2,
};
