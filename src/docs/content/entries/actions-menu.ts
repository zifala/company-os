import type { DocEntry } from '../types';

export const actionsMenu: DocEntry = {
    slug: 'actions-menu',
    name: 'ActionsMenu',
    category: 'page-kit',
    pieces: [20],
    tagline: 'The "…" menu for a row or a record header. Destructive items in rose, dialogs opened by state.',
    job: 'Hold the secondary and destructive actions of one record.',
    tags: ['menu', 'row actions', 'dropdown', 'destructive'],
    exports: ['ActionsMenu', 'ActionsMenuItem'],
    files: ['components/company-os/actions-menu.tsx'],
    shadcnDeps: ['button', 'dropdown-menu'],
    intro: [
        'An icon-only trigger and a list of <code>{ label, onSelect, destructive? }</code>. A row with more than two actions gets one of these, never a row of buttons. A menu with one non-destructive item is a button instead.',
        'Dialogs never live inside the menu: a menu item sets state, the ReasonDialog or ConfirmDialog renders outside with <code>open</code> and <code>onOpenChange</code>. The menu is non-modal so a dialog it opens keeps focus right.',
    ],
    examples: [
        {
            title: 'Record header',
            demoKey: 'actions-menu-basic',
            code: `import { ActionsMenu, ReasonDialog } from '@/components/company-os';

const [deactivating, setDeactivating] = useState(false);

<ActionsMenu items={[
  { label: 'Export contact', onSelect: () => (window.location.href = exportUrl) },
  { label: 'Merge into another', onSelect: () => setMerging(true) },
  { label: 'Deactivate contact', destructive: true, onSelect: () => setDeactivating(true) },
]} />
<ReasonDialog open={deactivating} onOpenChange={setDeactivating} … />`,
        },
    ],
    props: [
        {
            component: 'ActionsMenu',
            rows: [
                { name: 'items', type: 'ActionsMenuItem[]', description: '<code>{ label, onSelect, destructive? }</code>. Labels name verb + object.' },
                { name: 'label', type: 'string', defaultValue: "'More actions'", description: 'The trigger\'s accessible name.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Enter · Space', action: 'Opens the menu.' },
            { keys: '↑ ↓', action: 'Moves between items.' },
            { keys: 'Esc', action: 'Closes it.' },
        ],
        notes: ['The icon-only trigger carries <code>aria-label</code>; the menu is a Radix menu with full roving focus.'],
    },
    donts: [
        'No dialog rendered inside a menu item; it unmounts with the menu.',
        'No serious status change from a table row. Deactivate, delete and reject live on the record page.',
        'No icons in menu items; the label is enough.',
    ],
    faq: [
        { q: 'One action only?', a: 'Render a button. The menu is for three or more, or for anything destructive.' },
    ],
};
