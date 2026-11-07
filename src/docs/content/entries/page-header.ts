import type { DocEntry } from '../types';

export const pageHeader: DocEntry = {
    slug: 'page-header',
    name: 'PageHeader',
    category: 'page-kit',
    pieces: [20],
    tagline: 'The one h1 of a page, with its own create and export actions on the right.',
    job: 'Name the page and hold the actions that belong to the whole page.',
    tags: ['header', 'title', 'h1', 'create', 'actions'],
    exports: ['PageHeader'],
    files: ['components/company-os/page-header.tsx'],
    intro: [
        'One <code>&lt;h1&gt;</code> on the left, optional <code>meta</code> beside it (a status pill, a reference), and the page actions on the right. Nothing sits above the title: no breadcrumb, no eyebrow, no section label. The active sidebar item already says where you are.',
        'The header owns the page\'s "+ Create". The app header never carries a create button; the sidebar carries one global "New". Export, saved views and filters live in the <b>FilterBar</b> below, not here.',
    ],
    examples: [
        {
            title: 'Index page',
            description: 'Title plus the page\'s own create action.',
            demoKey: 'page-header-index',
            code: `import { PageHeader } from '@/components/company-os';

<PageHeader title="Contacts">
  {can.create && <Button><PlusIcon /> Create contact</Button>}
</PageHeader>`,
        },
        {
            title: 'Record page',
            description: 'Meta beside the title, the actions menu on the right.',
            demoKey: 'page-header-record',
            code: `<PageHeader title={contact.name} meta={<Pill name="Active" color="emerald" />}>
  <Button variant="outline">Edit</Button>
  <ActionsMenu items={[{ label: 'Deactivate contact', destructive: true, onSelect: open }]} />
</PageHeader>`,
        },
    ],
    props: [
        {
            component: 'PageHeader',
            rows: [
                { name: 'title', type: 'string', description: 'The page name. A fixed label, never data: "Contacts", not "42 contacts".' },
                { name: 'meta', type: 'ReactNode', description: 'Small facts beside the title: a status pill, a reference code.' },
                { name: 'children', type: 'ReactNode', description: 'Page actions, right-aligned. Primary create first, then outline buttons, then the "…" menu.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'Renders the page\'s only <code>&lt;h1&gt;</code>. Sections below start at <code>&lt;h2&gt;</code>.',
            'Actions are real buttons or links; the header adds no landmarks of its own.',
        ],
    },
    donts: [
        'No breadcrumb, kicker, date line or description above or under the title.',
        'No data in the title. The count goes in the table footer, the status in <code>meta</code>.',
        'No filters or search in the header. That is the FilterBar.',
        'No create button anywhere else on the page.',
    ],
    faq: [
        { q: 'Where does the subtitle go?', a: 'Nowhere. The heading speaks alone. Explanation belongs in an empty state or a field hint.' },
        { q: 'Full-page form?', a: 'Same header, sticky at the top, with Cancel and Save as its children. Never a footer bar.' },
    ],
};
