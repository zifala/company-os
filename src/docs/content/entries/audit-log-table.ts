import type { DocEntry } from '../types';

export const auditLogTable: DocEntry = {
    slug: 'audit-log-table',
    name: 'AuditLogTable',
    category: 'organization',
    pieces: [2, 23],
    tagline: 'One table of every event: when, who and through which channel, the event label over its raw name, the subject, the reason.',
    job: 'Show the audit log the way the audit recipe stores it, filterable and exportable, without a second design per module.',
    tags: ['audit', 'activity', 'log', 'events', 'reason', 'via', 'channel', 'csv'],
    exports: ['AuditLogTable', 'auditLogLabels', 'AuditEvent', 'AuditLogLabels'],
    files: ['components/company-os/audit-log-table.tsx'],
    registryDeps: ['cells', 'data-table'],
    shadcnDeps: ['table'],
    intro: [
        'The page behind <code>reports.audit</code>. Rows arrive from <code>AuditLog::page()</code>, 50 per page, newest first, in the viewer\'s timezone. The label comes from <code>lang/*/audit.php</code>; the raw event name stays underneath because event names are a public contract.',
        'The channel line under the person reads the server\'s <code>via</code> string — "via automation “Overdue chaser”" — and is absent for web. A row with no causer is the system. Empty keeps the table: the filters stay above it.',
    ],
    examples: [
        {
            title: 'Under the filter bar',
            demoKey: 'audit-log-table-basic',
            code: `import { AuditLogTable, ExportButton, FilterBar } from '@/components/company-os';

<FilterBar state={filters} end={<ExportButton href={exportUrl} label="Export CSV" />} />
<AuditLogTable page={events} events={events.data} />`,
        },
        {
            title: 'Nothing matches',
            demoKey: 'audit-log-table-empty',
            code: `<AuditLogTable page={empty} events={[]} />`,
        },
    ],
    props: [
        {
            component: 'AuditLogTable',
            rows: [
                { name: 'page', type: 'Paginated<unknown>', description: 'The paginator, for the footer count and pager.' },
                { name: 'events', type: 'AuditEvent[]', description: '<code>{ id, at, actor, event: { name, label }, subject, via, reason }</code>. <code>actor</code> null means the system.' },
                { name: 'empty', type: 'ReactNode', description: 'Extra content in the empty row, e.g. a Clear filters button.' },
                { name: 'pageLabels', type: 'PageLabels', description: 'Footer and pager copy.' },
                { name: 'labels', type: 'Partial<AuditLogLabels>', description: 'Column heads, the system name, empty copy.' },
            ],
        },
    ],
    a11y: { notes: ['The full timestamp is the cell text; the relative time is its title.', 'Subjects are links to the record, labelled by the record name.'] },
    donts: [
        'No edit or delete on a row. Stamp, never erase.',
        'No raw enum value for the channel. The server sends the translated line.',
        'No secrets, tokens or long text bodies in the reason column — the recipe never logs them.',
    ],
    faq: [
        { q: 'Where do the filters come from?', a: 'FilterBar with person, event prefix (distinct prefixes before the first dot), channel, from and to. The same filters drive the CSV export.' },
        { q: 'Why both label and raw name?', a: 'People read the label; integrators, webhooks and reports key on the raw name. Unknown events fall back to the raw name as the label.' },
    ],
};
