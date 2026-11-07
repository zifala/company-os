import type { DocEntry } from '../types';

export const shortcutHelp: DocEntry = {
    slug: 'shortcut-help',
    name: 'ShortcutHelp',
    category: 'shell',
    pieces: [13],
    tagline: 'The ? sheet. Every key the shell answers to, grouped, with the go-keys generated from the nav.',
    job: 'Show the keyboard once so people stop using the mouse.',
    tags: ['shortcuts', 'keyboard', 'help', 'sheet', 'kbd'],
    exports: ['ShortcutHelp', 'shellShortcutGroups', 'shellShortcutLabels', 'ShortcutGroup', 'ShellShortcutLabels'],
    files: ['components/company-os/shortcut-help.tsx'],
    registryDeps: ['nav'],
    shadcnDeps: ['sheet', 'kbd'],
    intro: [
        'A right-hand Sheet with one section per group: a small uppercase heading, then label left and keys right as <code>Kbd</code> chips. <code>shellShortcutGroups(goShortcuts)</code> builds the two shell groups, <b>Anywhere</b> (⌘K, /, N, ?) and <b>Go to</b> (G + each nav <code>goKey</code>). Modules append their own groups to the array.',
        'Controlled: the layout opens it from <code>useShortcuts</code> on <code>?</code> and from the "Show keyboard shortcuts" palette action. Every string is a label prop.',
    ],
    examples: [
        {
            title: 'Shell groups',
            demoKey: 'shortcut-help',
            code: `import { ShortcutHelp, goShortcuts, shellShortcutGroups } from '@/components/company-os';

const groups = [
  ...shellShortcutGroups(goShortcuts(navGroups, auth.permissions), { create: 'Create task' }),
  { name: 'Task under the pointer', items: [{ keys: ['S'], label: 'Change stage' }, { keys: ['A'], label: 'Assign' }] },
];

<ShortcutHelp open={help} onOpenChange={setHelp} groups={groups} />`,
        },
    ],
    props: [
        {
            component: 'ShortcutHelp',
            rows: [
                { name: 'open · onOpenChange', type: 'boolean · (open) => void', description: 'Controlled by the layout.' },
                { name: 'groups', type: 'ShortcutGroup[]', description: '<code>{ name, items: { keys: string[], label }[] }[]</code>. Keys render as separate chips.' },
                { name: 'title', type: 'string', defaultValue: "'Keyboard shortcuts'", description: 'Sheet title.' },
            ],
        },
        {
            component: 'shellShortcutGroups',
            rows: [
                { name: 'goShortcuts', type: 'GoShortcut[]', description: 'From <code>goShortcuts(groups, permissions)</code>. Empty → no Go to group.' },
                { name: 'labels', type: 'Partial<ShellShortcutLabels>', description: 'anywhere, goTo, palette, search, quickCreate, help, and <code>create</code> for the <code>C</code> row (omitted when unset).' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: '?', action: 'Open from anywhere when not typing.' },
            { keys: 'Esc', action: 'Close the sheet.' },
        ],
        notes: [
            'Keys are <code>&lt;kbd&gt;</code> elements, read as keys by screen readers.',
            'The sheet is a Radix dialog: focus moves in, returns to the opener on close.',
        ],
    },
    donts: [
        'No keys the app does not handle. The list is documentation of <code>useShortcuts</code> and module hooks, nothing more.',
        'No go-keys typed by hand. They come from the nav list.',
        'No tooltip version. One sheet, one key to open it.',
    ],
    faq: [
        { q: 'Where do module shortcuts go?', a: 'Append a group per module to the array the layout passes. The hook that handles them lives beside that module.' },
    ],
};
