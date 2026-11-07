import type { DocEntry } from '../types';

export const detailCard: DocEntry = {
    slug: 'detail-card',
    name: 'DetailCard',
    category: 'page-kit',
    pieces: [7, 20, 27],
    tagline: 'A record readout: a titled glass card of label and value pairs. Main facts left, fixed facts right.',
    job: 'State a set of labelled facts about one record.',
    tags: ['detail', 'record', 'readout', 'description list', 'show page'],
    exports: ['DetailCard', 'DetailList', 'Detail'],
    files: ['components/company-os/detail-card.tsx'],
    registryDeps: ['cells'],
    intro: [
        'A real <code>&lt;dl&gt;</code> in a glass card with a small title and an optional action. Two columns on wide screens, one when <code>compact</code>, which is the shape of the small side cards on a record page: plan, language, identity, finance, source, onboarding.',
        '<b>DetailList</b> is the bare list for use inside another card or a dialog. Null values render the muted dash; a fact with no value is better omitted.',
    ],
    examples: [
        {
            title: 'Main card and side card',
            demoKey: 'detail-card-pair',
            code: `import { DetailCard } from '@/components/company-os';

<DetailCard title="Company" details={[
  { label: 'Legal name', value: 'Halcyon Freight Ltd' },
  { label: 'Registration', value: <span className="font-mono text-xs">REG-2019-4471</span> },
  { label: 'Industry', value: 'Logistics' },
  { label: 'Website', value: 'halcyon.example' },
]} />
<DetailCard compact title="Onboarding" details={[
  { label: 'Reference', value: 'ONB-0007' },
  { label: 'Started by', value: 'Hodan Ali' },
  { label: 'Approved by', value: 'Ayaan Warsame' },
  { label: 'Source', value: 'Referral' },
]} />`,
        },
    ],
    props: [
        {
            component: 'DetailCard',
            rows: [
                { name: 'title', type: 'string', description: 'The card heading.' },
                { name: 'details', type: 'Detail[]', description: '<code>{ label, value }</code>. Value is any node; null shows a dash.' },
                { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'One column, for side cards.' },
                { name: 'action', type: 'ReactNode', description: 'Right of the title: an Edit button.' },
            ],
        },
        {
            component: 'DetailList',
            rows: [{ name: 'details', type: 'Detail[]', description: 'Same rows, no card.' }],
        },
    ],
    a11y: {
        notes: ['<code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code>, <code>&lt;dd&gt;</code> markup: a screen reader pairs each label with its value.'],
    },
    donts: [
        'No inputs inside a value. Editing is "Update" on the card action, then a form.',
        'No two records side by side in one card; that is a table.',
        'No empty rows. Omit, or say "None recorded".',
    ],
    faq: [{ q: 'Where does the Edit button go?', a: 'In <code>action</code>. Read-only first, then fields appear; never an always-editable view.' }],
};
