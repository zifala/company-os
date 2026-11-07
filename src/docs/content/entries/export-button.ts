import type { DocEntry } from '../types';

export const exportButton: DocEntry = {
    slug: 'export-button',
    name: 'ExportButton',
    category: 'views',
    pieces: [15],
    tagline: 'A plain download link styled as an outline button. Exports what the list shows.',
    job: 'Download the current list as CSV.',
    tags: ['export', 'csv', 'download'],
    exports: ['ExportButton'],
    files: ['components/company-os/export-button.tsx'],
    shadcnDeps: ['button'],
    intro: [
        'An <code>&lt;a download&gt;</code>, nothing more. The href carries the list\'s current filters so the file matches the screen; the server streams UTF-8 with a BOM, guards formula cells, and caps the rows.',
    ],
    examples: [
        {
            title: 'Next to the filters',
            demoKey: 'export-button-basic',
            code: `import { ExportButton } from '@/components/company-os';

<FilterBar state={state} end={<ExportButton href={contacts.export.url({ query: filters })} />} />`,
        },
    ],
    props: [
        {
            component: 'ExportButton',
            rows: [
                { name: 'href', type: 'string', description: 'The export route with the current query.' },
                { name: 'label', type: 'string', defaultValue: "'Export'", description: 'Button text.' },
            ],
        },
    ],
    a11y: { notes: ['A real link: it works with middle-click and is announced as a download.'] },
    donts: ['No client-side CSV building.', 'No export of more than the user may see; the server applies the same scope as the list.'],
    faq: [{ q: 'Excel?', a: 'CSV opens in Excel; the BOM keeps non-Latin text intact.' }],
};
