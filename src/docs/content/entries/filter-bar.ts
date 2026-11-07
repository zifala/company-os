import type { DocEntry } from '../types';

export const filterBar: DocEntry = {
    slug: 'filter-bar',
    name: 'FilterBar',
    category: 'page-kit',
    pieces: [20, 15],
    tagline: 'Search, inline filters, an overflow popover, and removable chips. The query string is the state.',
    job: 'Narrow one index table from the URL, one field per filterable column.',
    tags: ['filters', 'search', 'chips', 'query string', 'index'],
    exports: ['FilterBar', 'FilterChips', 'FilterControl', 'applyFilters', 'activeFilters', 'FilterState', 'FilterField'],
    files: ['components/company-os/filter-bar.tsx', 'components/company-os/filter-chips.tsx', 'components/company-os/filter-control.tsx'],
    shadcnDeps: ['button', 'input', 'label', 'popover', 'select', 'command'],
    intro: [
        'A page declares its filters once as a <code>FilterState</code>: the index <code>url</code>, the current <code>filters</code> from the query string, and the <code>fields</code> it offers. Every filterable column the table shows gets a field; never only one. Inline fields sit in the bar, the rest fold into a "Filters" popover that counts its active fields.',
        'Every change calls <code>applyFilters</code>, which writes the merged query to the URL with <code>preserveState</code> and <code>replace</code>, so Laravel re-renders the deferred rows, the back button stays sane, and a saved view can compare the same query later. Empty values are dropped so URLs stay short.',
        'Active filters render as chips under the bar with a remove button each and one "Clear filters". A value equal to a field\'s <code>defaultValue</code> is not a chip. The same chips go inside <b>TableEmptyRow</b> when the filters hide every row.',
    ],
    examples: [
        {
            title: 'Index filters',
            description: 'Search on Enter, status and owner inline, source and period in the popover. Chips appear as filters are set.',
            demoKey: 'filter-bar-basic',
            code: `import { FilterBar } from '@/components/company-os';
import type { FilterState } from '@/components/company-os';

const state: FilterState = {
  url: contacts.index().url,
  filters,
  searchPlaceholder: 'Search contacts',
  fields: [
    { key: 'status', label: 'Status', inline: true, placeholder: 'All statuses', options: lookups.statuses },
    { key: 'owner', label: 'Owner', inline: true, placeholder: 'Anyone', options: lookups.owners, searchable: true },
    { key: 'source', label: 'Source', placeholder: 'Any source', options: lookups.sources },
    { key: 'period', label: 'Created', placeholder: 'Any time', options: lookups.periods },
  ],
};

<FilterBar state={state} end={<ExportButton href={contacts.export.url({ query: filters })} />} />`,
        },
    ],
    props: [
        {
            component: 'FilterBar',
            rows: [
                { name: 'state', type: 'FilterState', description: '<code>{ url, filters, fields, searchPlaceholder? }</code>. A search box renders only when <code>searchPlaceholder</code> is set.' },
                { name: 'end', type: 'ReactNode', description: 'Right slot: saved views menu, export button.' },
                { name: 'labels', type: 'FilterBarLabels', description: '<code>filters</code>, <code>clearFilters</code>, <code>search</code>. Pass translated copy.' },
            ],
        },
        {
            component: 'FilterField',
            rows: [
                { name: 'key · label', type: 'string', description: 'Query key and visible label.' },
                { name: 'options', type: 'Option[]', description: '<code>{ value, label }</code> from the server.' },
                { name: 'inline', type: 'boolean', description: 'In the bar instead of the popover.' },
                { name: 'searchable', type: 'boolean', description: 'Combobox instead of the plain dropdown. Use beyond ~7 options.' },
                { name: 'text', type: 'boolean', description: 'A free text input, applied on Enter.' },
                { name: 'defaultValue', type: 'string', description: 'The value that counts as "no filter"; never shown as a chip.' },
            ],
        },
        {
            component: 'applyFilters · activeFilters',
            rows: [
                { name: 'applyFilters(state, changes)', type: 'function', description: 'Merges, drops empty values, navigates with preserveState + replace.' },
                { name: 'activeFilters(state)', type: 'ActiveFilter[]', description: 'The chips: search first, then each field with a non-default value.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Enter', action: 'Applies the search or a text field.' },
            { keys: 'Tab', action: 'Moves through fields, the Filters button, chips and their remove buttons.' },
        ],
        notes: [
            'Every control carries an <code>aria-label</code> from its field label; inline fields have no visible label by design.',
            'Each chip\'s remove button is named "Remove <filter>".',
            'Dropdowns and the popover render in portals, so they escape scrolling containers.',
        ],
    },
    donts: [
        'No filter state in React. The URL is the state; Laravel reads it.',
        'No native <code>&lt;select&gt;</code>. Plain dropdown for short lists, combobox beyond ~7.',
        'No single-filter bars. Every filterable column the table shows gets a field.',
        'No filtering on the client. The server narrows the rows.',
    ],
    faq: [
        { q: 'Where do saved views plug in?', a: 'SavedViewsMenu takes the same FilterState and compares its query to each saved view; put it in the <code>end</code> slot.' },
        { q: 'How does the table know it is filtered to nothing?', a: 'The page checks <code>activeFilters(state).length</code> and renders TableEmptyRow with "No X match these filters" and the FilterChips as children.' },
    ],
};
