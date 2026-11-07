import type { DocEntry } from '../types';

export const commandPalette: DocEntry = {
    slug: 'command-palette',
    name: 'CommandPalette',
    category: 'shell',
    pieces: [13],
    tagline: 'One ⌘K dialog that finds records, runs actions and goes to pages. The server searches; the nav list supplies Go to.',
    job: 'Reach any record, verb or page from the keyboard in one box.',
    tags: ['palette', 'search', 'command', 'shortcuts', 'cmdk', 'go-to'],
    exports: ['CommandPalette', 'useRecordSearch', 'useShortcuts', 'goItems', 'matchesTerm', 'paletteLabels', 'PaletteItem', 'FoundGroup', 'PaletteLabels', 'RecordSearch', 'ShortcutHandlers'],
    files: [
        'components/company-os/command-palette.tsx',
        'components/company-os/command-palette-items.ts',
        'components/company-os/use-record-search.ts',
        'components/company-os/use-shortcuts.ts',
    ],
    registryDeps: ['nav'],
    shadcnDeps: ['command', 'dialog', 'kbd', 'skeleton'],
    intro: [
        'Three sections in one list, in this order: <b>record groups</b> from the server, <b>Actions</b> (create verbs, "Show keyboard shortcuts"), <b>Go to</b> (every nav item the user may see, with its <code>G X</code> key). The palette never fetches. The page passes <code>onSearch(term)</code>; the hook debounces 200 ms, asks at 2+ characters, shows two skeleton rows while waiting and one rose line on failure.',
        '<code>shouldFilter={false}</code>: the server filters records, the palette filters actions and Go to by label. Running an item closes the dialog and clears the query. Items with a URL go through <code>onNavigate</code>; items with a function run it. <code>useShortcuts</code> is the one global key listener: ⌘K / Ctrl+K anywhere, <code>/</code> <code>n</code> <code>c</code> <code>?</code> and <code>g</code>-then-key only when nobody is typing and no dialog is open.',
    ],
    examples: [
        {
            title: 'Palette with record search',
            description: 'The demo resolves two sample groups after 300 ms. Type "ha" to see them, "con" for an action and a page.',
            demoKey: 'command-palette',
            code: `import { CommandPalette, SearchButton, useShortcuts } from '@/components/company-os';
import { navGroups } from '@/components/app-sidebar-items';
import { actionItems } from '@/components/command-palette-items';
import { router, usePage } from '@inertiajs/react';
import { search } from '@/routes';

const { auth } = usePage().props;
const [open, setOpen] = useState(false);

const searchRecords = (term: string) =>
  fetch(search.url({ query: { q: term } }), { headers: { Accept: 'application/json' } })
    .then((response) => response.json())
    .then((body) => body.groups);

useShortcuts({
  groups: navGroups,
  permissions: auth.permissions,
  onPalette: () => setOpen((value) => !value),
  onQuickCreate: () => setCreating(true),
  onHelp: () => setHelp(true),
  onNavigate: (url) => router.visit(url),
});

<SearchButton onClick={() => setOpen(true)} />
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  groups={navGroups}
  permissions={auth.permissions}
  actions={actionItems}
  onSearch={searchRecords}
  onNavigate={(url) => router.visit(url)}
/>`,
        },
    ],
    props: [
        {
            component: 'CommandPalette',
            rows: [
                { name: 'open', type: 'boolean', description: 'Controlled. The header SearchButton and ⌘K both set it.' },
                { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Closing clears the query.' },
                { name: 'placeholder', type: 'string', defaultValue: "'Search a record or type a command'", description: 'Input placeholder. Name the record kinds your product has.' },
                { name: 'groups', type: 'NavGroup[]', description: 'The sidebar nav list. Go to is derived from it with <code>visibleGroups</code>; never a second list.' },
                { name: 'permissions', type: 'string[]', description: 'Granted permissions. Gates actions and Go to.' },
                { name: 'actions', type: 'PaletteItem[]', description: 'Create verbs and utilities: <code>{ label, icon, shortcut?, permission?, anyPermission?, run }</code>. <code>run</code> is a URL or a function.' },
                { name: 'onSearch', type: '(term: string) => Promise<FoundGroup[]>', description: 'Record search. Omit it and the palette is actions + Go to only.' },
                { name: 'onNavigate', type: '(url: string) => void', description: 'Called with the URL of a record or a URL item. Pass <code>router.visit</code>.' },
                { name: 'labels', type: 'Partial<PaletteLabels>', description: 'title, actions, goTo, failed, empty. English defaults.' },
            ],
        },
        {
            component: 'useShortcuts',
            rows: [
                { name: 'groups · permissions', type: 'NavGroup[] · string[]', description: 'Source of the <code>g</code>-keys via <code>goShortcuts</code>.' },
                { name: 'onPalette · onQuickCreate · onHelp', type: '() => void', description: '⌘K and <code>/</code> · <code>n</code> · <code>?</code>.' },
                { name: 'onCreate', type: '() => void', description: '<code>c</code>, the one primary create. Omit and <code>c</code> does nothing.' },
                { name: 'onNavigate', type: '(url: string) => void', description: 'Called after <code>g</code> then a go-key, within 1.2 s.' },
            ],
        },
        {
            component: 'useRecordSearch',
            rows: [
                { name: 'onSearch', type: 'RecordSearch', description: 'Returns <code>{ query, setQuery, searching, groups, failed }</code>. 200 ms debounce, 2-character minimum, stale responses dropped.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: '⌘K / Ctrl+K', action: 'Toggle the palette, also while typing in a field.' },
            { keys: '/', action: 'Open the palette when not typing.' },
            { keys: '↑ ↓', action: 'Move through results; the list loops.' },
            { keys: 'Enter', action: 'Run the selected item.' },
            { keys: 'Esc', action: 'Close and clear.' },
            { keys: 'G then H', action: 'Go to Home; each nav item declares its own <code>goKey</code>.' },
        ],
        notes: [
            'The dialog carries a visually hidden title from <code>labels.title</code>.',
            'cmdk marks the list as <code>role="listbox"</code> with one <code>aria-selected</code> option; group headings are real headings.',
            'Single-key shortcuts ignore inputs, textareas, selects, contenteditable and any open dialog.',
        ],
    },
    donts: [
        'No fetch inside the palette. The page passes <code>onSearch</code>.',
        'No hand-kept Go to list. It is the sidebar nav, gated the same way.',
        'No go-key from a translated title. The nav item declares <code>goKey</code>.',
        'No search under 2 characters. No search engine until ILIKE is measurably slow.',
        'No task or row shortcuts in the shell hook. Module keys live with the module.',
    ],
    faq: [
        { q: 'Where does the search endpoint live?', a: 'One <code>GET search?q=</code> route returning <code>{ groups }</code>, each group filtered with the same scope as its index page. The palette is the easiest permission leak; test it.' },
        { q: 'How do download links work?', a: 'Give the action a function that sets <code>window.location</code>. URL items always go through <code>onNavigate</code>.' },
        { q: 'Who hosts useShortcuts?', a: 'The app layout, once. It owns the open state of the palette, the quick-create menu and the shortcut sheet.' },
    ],
};
