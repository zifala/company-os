import type { DocEntry } from '../types';

export const cells: DocEntry = {
    slug: 'cells',
    name: 'Cells',
    category: 'page-kit',
    pieces: [20],
    tagline: 'One cell per data kind. Laravel formats, the cell only places.',
    job: 'Render one typed value in one table cell, aligned and styled for its kind.',
    tags: ['table', 'cell', 'money', 'date', 'status', 'person', 'typed'],
    exports: ['MoneyCell', 'NumberCell', 'DateCell', 'StatusCell', 'PersonCell', 'CodeCell', 'BooleanCell', 'LinkCell', 'TextCell', 'EmptyValue'],
    files: ['components/company-os/cells.tsx'],
    registryDeps: ['pill'],
    shadcnDeps: ['table'],
    intro: [
        'Every table cell is one of these. Never a bare <code>&lt;span&gt;</code>. Each takes a ready shape from the server: <code>Money</code> is <code>{ formatted, currency }</code>, <code>Day</code> is <code>{ label, relative }</code>, <code>Status</code> is <code>{ label, color }</code>. Null renders a muted dash.',
        'Cells stack what belongs together: name over detail, status pill over its date, person over their organisation. One cell, two lines. Never a column per fact, so the table survives a narrow layout.',
    ],
    examples: [
        {
            title: 'A row of typed cells',
            description: 'Money right-aligned and tabular. Date with the relative time in the tooltip. Status as a pill. Person as a name.',
            demoKey: 'cells-row',
            code: `import { LinkCell, StatusCell, PersonCell, MoneyCell, DateCell } from '@/components/company-os';

<TableRow>
  <LinkCell value={{ label: invoice.number, href: show(invoice.id), detail: invoice.customer }} />
  <StatusCell value={invoice.status} detail={invoice.due.label} />
  <PersonCell value={invoice.owner} />
  <MoneyCell value={invoice.total} />
  <DateCell value={invoice.issued} />
</TableRow>`,
        },
    ],
    props: [
        {
            component: 'MoneyCell',
            rows: [
                { name: 'value', type: 'Money', description: '<code>{ formatted, currency } | null</code>. Right-aligned, tabular, bold.' },
                { name: 'strong', type: 'boolean', defaultValue: 'true', description: 'Bold value. Off for secondary amounts.' },
            ],
        },
        {
            component: 'NumberCell',
            rows: [
                { name: 'value', type: 'string | null', description: 'Formatted by the server.' },
                { name: 'unit', type: 'string', description: 'Shown soft after the value: "h", "%".' },
            ],
        },
        {
            component: 'DateCell',
            rows: [{ name: 'value', type: 'Day', description: '<code>{ label, relative } | null</code>. Relative text in the tooltip.' }],
        },
        {
            component: 'StatusCell',
            rows: [
                { name: 'value', type: 'Status | null', description: '<code>{ label, color }</code> → Pill.' },
                { name: 'detail', type: 'string', description: 'Small line under the pill: the date it entered this status.' },
            ],
        },
        {
            component: 'PersonCell',
            rows: [{ name: 'value', type: 'Person', description: '<code>{ name, detail? } | null</code>. A person is a name; no avatar in tables.' }],
        },
        {
            component: 'LinkCell',
            rows: [{ name: 'value', type: 'Target', description: '<code>{ label, href, detail? }</code>. The primary column, bold, opens the record.' }],
        },
        {
            component: 'CodeCell · BooleanCell · TextCell',
            rows: [
                { name: 'value', type: 'string | Flag', description: 'CodeCell: mono, muted. BooleanCell: icon + word.' },
                { name: 'children · detail', type: 'ReactNode · string', description: 'TextCell: main line and optional small line.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'Every cell is a real <code>&lt;td&gt;</code>; the column header takes the same alignment.',
            'Boolean shows an icon and a word; the icon never carries the fact alone.',
            'The relative date lives in <code>title</code> so the visible value stays the exact date.',
        ],
    },
    donts: [
        'No formatting in React: no number, date or currency formatting, no translation.',
        'No avatars or images in tables.',
        'No "submitted 27 Oct" wording in a date cell. The column says what the date is.',
        'No bare count. A number carries its noun or lives in a Pill.',
    ],
    faq: [
        { q: 'Where is PercentCell?', a: 'NumberCell with <code>unit="%"</code>. The server sends the formatted number.' },
        { q: 'How do I show who is assigned?', a: 'On the record page. Secondary facts are never columns.' },
    ],
};
