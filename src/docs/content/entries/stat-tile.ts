import type { DocEntry } from '../types';

export const statTile: DocEntry = {
    slug: 'stat-tile',
    name: 'StatTile',
    category: 'page-kit',
    pieces: [20],
    tagline: 'One number with its label, unit and hint. Quiet by default, raised glass above a list.',
    job: 'State one figure the server computed.',
    tags: ['kpi', 'stat', 'tile', 'dashboard', 'number'],
    exports: ['StatTile'],
    files: ['components/company-os/stat-tile.tsx'],
    intro: [
        'Value bold and tabular, unit soft after it, label under, hint faint. The quiet variant is a soft slate fill for figures inside a card; <code>raised</code> makes it a glass card for the KPI row above a list or a board. With <code>href</code> the tile is a link to the list it counts.',
        'The server sends the formatted value. The tile never computes, rounds or formats.',
    ],
    examples: [
        {
            title: 'Raised row above a list',
            demoKey: 'stat-tile-row',
            code: `import { StatTile } from '@/components/company-os';

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatTile raised label="Open deals" value="18" hint="4 closing this week" href={deals.index({ query: { status: 'open' } })} />
  <StatTile raised label="Pipeline" value="412,800" unit="USD" />
  <StatTile raised label="Won this month" value="6" />
  <StatTile raised label="Win rate" value="38" unit="%" hint="last 90 days" />
</div>`,
        },
        {
            title: 'Quiet, inside a card',
            demoKey: 'stat-tile-quiet',
            code: `<StatTile label="Logged this week" value="31.5" unit="h" />`,
        },
    ],
    props: [
        {
            component: 'StatTile',
            rows: [
                { name: 'label', type: 'string', description: 'What the number is.' },
                { name: 'value', type: 'ReactNode', description: 'Formatted by the server.' },
                { name: 'unit', type: 'string', description: 'Soft text after the value.' },
                { name: 'hint', type: 'string', description: 'Faint context line.' },
                { name: 'href', type: 'Href', description: 'Makes the tile a link.' },
                { name: 'raised', type: 'boolean', defaultValue: 'false', description: 'Glass card instead of the quiet fill.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'A linked tile is one anchor whose text reads value, unit, label and hint in order.',
            'Numbers use tabular figures so columns of tiles line up.',
        ],
    },
    donts: [
        'No big-number hero template: one accent colour per page, and it is not the tile.',
        'No math in the tile. Trends and deltas arrive from the server as text.',
        'No icon decoration.',
    ],
    faq: [
        { q: 'Delta or trend arrow?', a: 'Send it in <code>hint</code> as words ("+3 vs last month"). Arrows and colours would need server-side polarity that the recipe does not define yet.' },
    ],
};
