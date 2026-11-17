import type { DocEntry } from '../types';

export const preferenceMatrix: DocEntry = {
    slug: 'preference-matrix',
    name: 'PreferenceMatrix',
    category: 'access',
    pieces: [10],
    tagline: 'Events down, channels across, one switch per cell. Quiet hours said once, under the grid.',
    job: 'Let each person pick which events reach them on which channel.',
    tags: ['notifications', 'preferences', 'matrix', 'channels', 'email', 'settings'],
    exports: ['PreferenceMatrix', 'preferenceMatrixLabels', 'PreferenceChannel', 'PreferenceEvent', 'PreferenceMatrixLabels', 'PreferenceValue'],
    files: ['components/company-os/preference-matrix.tsx'],
    shadcnDeps: ['switch'],
    intro: [
        'Rows are <code>NotificationEvent</code> cases, grouped by module when <code>group</code> is set. Columns are <code>NotificationChannel</code> cases. The server sends the effective value per cell: a saved row, or the default (in-app on, email for the email-by-default events, opt-in events off).',
        'A channel the user cannot receive yet (WhatsApp without a number) is greyed with a hint on its header. Saving posts the whole matrix; <code>UpdateNotificationPreferences</code> writes one row per cell in a transaction.',
    ],
    examples: [
        {
            title: 'Settings · Notifications',
            demoKey: 'preference-matrix-basic',
            code: `import { PreferenceMatrix } from '@/components/company-os';
import { useForm } from '@inertiajs/react';

const form = useForm({ preferences });

<PreferenceMatrix
  events={events}
  channels={channels}
  value={form.data.preferences}
  onChange={(preferences) => form.setData('preferences', preferences)}
  disabled={form.processing}
/>`,
        },
    ],
    props: [
        {
            component: 'PreferenceMatrix',
            rows: [
                { name: 'events', type: 'PreferenceEvent[]', description: '<code>{ key, label, hint?, group? }</code>. Consecutive events with the same group share a heading.' },
                { name: 'channels', type: 'PreferenceChannel[]', description: '<code>{ key, label, available?, unavailableHint? }</code>.' },
                { name: 'value · onChange', type: 'PreferenceValue', description: '<code>{ [event]: { [channel]: boolean } }</code>. A missing cell reads as off.' },
                { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'While saving.' },
                { name: 'labels', type: 'PreferenceMatrixLabels', description: 'event column header, quietHours line (<code>null</code> hides it).' },
            ],
        },
    ],
    a11y: { notes: ['A real table: events are row headers, channels column headers, module names colgroup headers.', 'Each switch is labelled "event: channel".'] },
    donts: ['No switch for in-app on reminders that must arrive; leave the event out instead.', 'No delaying in-app for quiet hours. Only channels that buzz a phone wait.', 'No guessing the default in React. The server sends the effective value.'],
    faq: [{ q: 'Where is the matrix?', a: 'Settings → Notifications, per user. Never in Organization.' }],
};
