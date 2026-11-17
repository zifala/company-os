import { AuditLogTable, ExportButton, FilterBar, PageHeader, SectionLayout } from '@/components/company-os';
import type { AuditEvent, FilterState, Paginated } from '@/components/company-os';
import { adminPermissions, organizationGroups } from './organization-nav';

const events: AuditEvent[] = [
    {
        id: '1',
        at: { label: '17 Nov 2026, 09:41', relative: '6 minutes ago' },
        actor: { name: 'Hodan Ali', detail: null },
        event: { name: 'deal.lost', label: 'Deal lost' },
        subject: { label: 'Cold chain audit', href: '#', detail: 'Deal · Kestrel Logistics' },
        via: null,
        reason: 'Client chose an in-house team after the pilot.',
    },
    {
        id: '2',
        at: { label: '17 Nov 2026, 09:12', relative: '35 minutes ago' },
        actor: { name: 'Mahad Yusuf', detail: null },
        event: { name: 'task.updated', label: 'Task updated' },
        subject: { label: 'ZW-142 Harbour terminal rollout', href: '#', detail: 'Task' },
        via: 'via automation “Overdue chaser”',
        reason: null,
    },
    {
        id: '3',
        at: { label: '17 Nov 2026, 08:58', relative: '49 minutes ago' },
        actor: { name: 'Ayaan Warsame', detail: null },
        event: { name: 'grant.given', label: 'Page granted' },
        subject: { label: 'Hodan Ali', href: '/templates/grants-page', detail: 'User · Reports · Margins' },
        via: null,
        reason: null,
    },
    {
        id: '4',
        at: { label: '17 Nov 2026, 03:00', relative: '7 hours ago' },
        actor: null,
        event: { name: 'webhook_endpoint.disabled', label: 'Webhook endpoint turned off' },
        subject: { label: 'hooks.ledgerline.example/in', href: '/templates/webhook-endpoint-page', detail: 'Webhook endpoint' },
        via: 'via automation “Webhook delivery”',
        reason: 'Every delivery failed for 3 days.',
    },
    {
        id: '5',
        at: { label: '16 Nov 2026, 17:20', relative: 'yesterday' },
        actor: { name: 'Farah Nur', detail: null },
        event: { name: 'invoice.voided', label: 'Invoice voided' },
        subject: { label: 'INV-0409', href: '#', detail: 'Invoice · Kestrel Logistics' },
        via: 'via agent “Finance assistant”',
        reason: 'Issued twice; INV-0410 replaces it.',
    },
    {
        id: '6',
        at: { label: '16 Nov 2026, 11:03', relative: 'yesterday' },
        actor: { name: 'Ayaan Warsame', detail: null },
        event: { name: 'workspace.two_factor_requirement_changed', label: 'Two-factor requirement changed' },
        subject: null,
        via: null,
        reason: null,
    },
];

const page: Paginated<AuditEvent> = { data: events, from: 1, to: 6, total: 1284, current_page: 1, last_page: 26, prev_page_url: null, next_page_url: '?page=2' };

const state: FilterState = {
    url: '/templates/audit-log-page',
    filters: { via: 'automation' },
    fields: [
        { key: 'causer', label: 'Person', inline: true, placeholder: 'Anyone', options: [{ value: 'ayaan', label: 'Ayaan Warsame' }, { value: 'hodan', label: 'Hodan Ali' }, { value: 'mahad', label: 'Mahad Yusuf' }, { value: 'farah', label: 'Farah Nur' }] },
        { key: 'event', label: 'Event', inline: true, placeholder: 'All events', options: [{ value: 'deal', label: 'deal.*' }, { value: 'invoice', label: 'invoice.*' }, { value: 'task', label: 'task.*' }, { value: 'grant', label: 'grant.*' }, { value: 'webhook_endpoint', label: 'webhook_endpoint.*' }, { value: 'workspace', label: 'workspace.*' }] },
        { key: 'via', label: 'Channel', inline: true, placeholder: 'Any channel', options: [{ value: 'web', label: 'Web' }, { value: 'api', label: 'API' }, { value: 'automation', label: 'Automation' }, { value: 'agent', label: 'Agent' }] },
        { key: 'from', label: 'From', text: true, placeholder: 'YYYY-MM-DD' },
        { key: 'to', label: 'To', text: true, placeholder: 'YYYY-MM-DD' },
    ],
};

export function AuditLogPage() {
    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Audit log" />
                <FilterBar state={state} end={<ExportButton href="#" label="Export CSV" />} />
                <AuditLogTable page={page} events={events} />
                <p className="text-xs text-muted-foreground">Times in your timezone (Africa/Mogadishu). The CSV is in UTC and keeps the raw event name.</p>
            </div>
        </SectionLayout>
    );
}
