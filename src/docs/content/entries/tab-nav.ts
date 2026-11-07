import type { DocEntry } from '../types';

export const tabNav: DocEntry = {
    slug: 'tab-nav',
    name: 'TabNav',
    category: 'page-kit',
    pieces: [20],
    tagline: 'Tabs that are routes. The active tab comes from the URL, never from state.',
    job: 'Switch between the sections of one record or one area, each on its own URL.',
    tags: ['tabs', 'routes', 'record page', 'navigation'],
    exports: ['TabNav', 'TabLink'],
    files: ['components/company-os/tab-nav.tsx'],
    intro: [
        'Each tab is a <code>Link</code> to a route. The active tab is the one whose path and query match the current URL, so a reload, a bookmark and the back button all land on the right section. An optional count sits beside the label.',
        'Tabs split a record page into sections (Overview, Meetings, Activity) or an area into reports. A tab never repeats a sidebar item: one home per page.',
    ],
    examples: [
        {
            title: 'Record sections',
            demoKey: 'tab-nav-record',
            code: `import { TabNav } from '@/components/company-os';

<TabNav
  label="Contact sections"
  tabs={[
    { label: 'Overview', href: contacts.show(contact.id) },
    { label: 'Meetings', href: contacts.meetings(contact.id), count: contact.meetings_count },
    { label: 'Activity', href: contacts.activity(contact.id) },
  ]}
/>`,
        },
    ],
    props: [
        {
            component: 'TabNav',
            rows: [
                { name: 'tabs', type: 'TabLink[]', description: '<code>{ label, href, count? }</code>. Count shows when above zero.' },
                { name: 'label', type: 'string', description: 'The <code>aria-label</code> of the nav.' },
            ],
        },
    ],
    a11y: {
        keyboard: [{ keys: 'Tab · Enter', action: 'Moves between tabs and opens one.' }],
        notes: [
            'A <code>&lt;nav aria-label&gt;</code> of links; the active one carries <code>aria-current="page"</code>.',
            'Links, not buttons: the browser owns history and middle-click.',
        ],
    },
    donts: [
        'No <code>useState</code> tabs. A tab without a URL is a defect.',
        'No tab that repeats a sidebar item.',
        'No icons in tabs.',
    ],
    faq: [
        { q: 'Tabs with query strings?', a: 'Supported. A tab href like <code>?tab=team</code> is active when the current query carries the same pair; the bare href is active only when the query is empty.' },
    ],
};
