import type { DocEntry } from '../types';

export const pill: DocEntry = {
    slug: 'pill',
    name: 'Pill',
    category: 'page-kit',
    pieces: [20],
    tagline: 'A tinted label for a status, a stage or a count. The tint is the colour; there is no dot.',
    job: 'State one status or category in one word.',
    tags: ['status', 'badge', 'pill', 'label', 'stage'],
    exports: ['Pill', 'pillTint', 'pillSolid', 'PillColor'],
    files: ['components/company-os/pill.tsx'],
    intro: [
        'Six colour names, each a 10% tint of a semantic token with the token deepened toward the ink as text: <b>slate</b> → <code>muted-foreground</code>, <b>indigo</b> → <code>primary</code>, <b>cyan</b> → <code>info</code>, <b>emerald</b> → <code>success</code>, <b>rose</b> → <code>destructive</code>, <b>amber</b> → <code>warning</code>. No palette literals, so each product\'s tokens decide the hue. The colour comes from the server with the label (<code>{ label, color }</code>), the same name a company picked for its stage or priority in Setup. React never maps a status name to a colour.',
        'The pill carries status, category and small counts ("3 projects"). It never carries an action and never stands in for a button. <code>pillTint</code> and <code>pillSolid</code> expose the same palette for icon chips and board column dots.',
    ],
    examples: [
        {
            title: 'Colours',
            demoKey: 'pill-tones',
            code: `import { Pill } from '@/components/company-os';

<Pill name="Draft" />
<Pill name="Submitted" color="indigo" />
<Pill name="In review" color="cyan" />
<Pill name="Approved" color="emerald" />
<Pill name="Overdue" color="amber" />
<Pill name="Rejected" color="rose" />`,
        },
        {
            title: 'Count',
            description: 'A number carries its noun. Never a bare count in a table.',
            demoKey: 'pill-count',
            code: `<Pill name="projects" count={3} color="indigo" />`,
        },
    ],
    props: [
        {
            component: 'Pill',
            rows: [
                { name: 'name', type: 'string', description: 'The word. Translated by the server.' },
                { name: 'color', type: 'string', defaultValue: "'slate'", description: 'slate · indigo · cyan · emerald · rose · amber. Unknown names fall back to slate.' },
                { name: 'count', type: 'number', description: 'Bold tabular number before the name.' },
                { name: 'className', type: 'string', description: 'Extra classes.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'The label is the information; the tint is supplementary. A screen reader hears the word.',
            'Text-on-tint contrast follows the product tokens; check each pair reaches 4.5:1 when you set <code>--success</code>, <code>--warning</code> and <code>--info</code>.',
        ],
    },
    donts: [
        'No dot before the text. The tint carries the colour.',
        'No solid fills. A pill is a tint with ink text.',
        'No colour decided in React from a status name. The server sends it.',
        'No pill as a button or link.',
    ],
    faq: [
        { q: 'How do I colour a stage a company named itself?', a: 'Setup stores a colour per stage, priority and label. The server sends it with the row; the pill never sees the stage name.' },
        { q: 'Where do the colours come from?', a: 'The token set: the names are stable server values, the colours are <code>muted-foreground</code>, <code>primary</code>, <code>info</code>, <code>success</code>, <code>destructive</code> and <code>warning</code>.' },
    ],
};
