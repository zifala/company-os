import type { DocEntry } from '../types';

export const activityTimeline: DocEntry = {
    slug: 'activity-timeline',
    name: 'ActivityTimeline',
    category: 'page-kit',
    pieces: [2, 23, 20],
    tagline: 'The audit log as a timeline: day groups, kind icon, actor, from → to pills, the reason.',
    job: 'Show the history of one record, or of everything, as the audit log recorded it.',
    tags: ['activity', 'audit', 'timeline', 'history', 'log'],
    exports: ['ActivityTimeline', 'ActivityEntryItem', 'ActivityEntry'],
    files: ['components/company-os/activity-timeline.tsx', 'components/company-os/activity-entry.tsx'],
    registryDeps: ['pill', 'empty-state'],
    intro: [
        'Entries arrive grouped by the server\'s <code>day_label</code>, each with a <code>kind</code> (created, updated, completed, deleted, commented, assigned, moved, uploaded), the actor, the sentence, the channel it came through (<code>via</code>: web, api, automation, agent), changes as <code>from → to</code> pills, and the reason when one was required.',
        'The same component serves a record\'s Activity tab, the home feed and the audit log page; <code>showSubject</code> adds the record link for the cross-record views. Empty renders the EmptyState.',
    ],
    examples: [
        {
            title: 'Record activity',
            demoKey: 'activity-timeline-record',
            code: `import { ActivityTimeline } from '@/components/company-os';

<ActivityTimeline entries={activity} />`,
        },
        {
            title: 'Audit log with subjects',
            demoKey: 'activity-timeline-audit',
            code: `<ActivityTimeline entries={activity} showSubject />`,
        },
    ],
    props: [
        {
            component: 'ActivityTimeline',
            rows: [
                { name: 'entries', type: 'ActivityEntry[]', description: 'Newest first, already grouped by <code>day_label</code> order.' },
                { name: 'showSubject', type: 'boolean', defaultValue: 'false', description: 'Show the record link on each entry.' },
                { name: 'labels', type: 'ActivityLabels', description: '<code>emptyTitle</code>, <code>emptyMessage</code>, <code>system</code>.' },
            ],
        },
        {
            component: 'ActivityEntry',
            rows: [
                { name: 'kind', type: 'string', description: 'Picks icon and colour. Unknown kinds fall back to a neutral activity icon.' },
                { name: 'actor', type: '{ name, initials } | null', description: 'Null renders the system label.' },
                { name: 'action · via', type: 'string', description: 'The sentence after the name, and the channel.' },
                { name: 'changes', type: '{ label, from, to }[]', description: 'Field changes; <code>to: null</code> renders the label alone.' },
                { name: 'reason', type: 'string', description: 'The reason stored on serious changes.' },
                { name: 'at · at_label · time_label · day_label', type: 'string', description: 'ISO time, full label, short time, and the day group, all from the server.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'An ordered list per day under an uppercase heading; each entry is a list item.',
            'The time is a <code>&lt;time dateTime&gt;</code> with the full label as its title.',
            'Icons are decorative; the sentence carries the event.',
        ],
    },
    donts: [
        'No date math in React. Day groups and labels come formatted.',
        'No editing from the timeline. History is stamped, never erased.',
        'No separate comment thread component; comments are entries of kind commented.',
    ],
    faq: [
        { q: 'Why is the reason shown?', a: 'Serious changes (reject, send back, disable, revoke, delete) require one. Showing it is the point of asking.' },
        { q: 'Pagination?', a: 'The page paginates; pass the current page of entries. A Pager under the timeline works like under a table.' },
    ],
};
