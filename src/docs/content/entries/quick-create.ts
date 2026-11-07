import type { DocEntry } from '../types';

export const quickCreate: DocEntry = {
    slug: 'quick-create',
    name: 'QuickCreate',
    category: 'shell',
    pieces: [13],
    tagline: 'The one global New menu, top of the sidebar. Items the user may create, nothing else.',
    job: 'Create any record from anywhere in two keystrokes.',
    tags: ['create', 'new', 'menu', 'sidebar', 'shortcut'],
    exports: ['QuickCreate', 'QuickCreateItem'],
    files: ['components/company-os/quick-create.tsx', 'hooks/use-controllable-open.ts'],
    shadcnDeps: ['dropdown-menu', 'sidebar'],
    intro: [
        'A primary sidebar button "New" with a dropdown of <code>{ kind, label, icon, shortcut?, onSelect }</code> items. The page filters items by the shared <code>can_create</code> map before passing them; with none left the button is not rendered. Small records open a dialog in place, big ones visit their create page. Both are the page\'s <code>onSelect</code>.',
        'Controlled or not: pass <code>open</code> and <code>onOpenChange</code> so <code>useShortcuts</code> can open it on <code>n</code>. One item carries the <code>C</code> shortcut, the record people make most. The button is <code>data-tour="quick-create"</code>.',
    ],
    examples: [
        {
            title: 'Three kinds',
            demoKey: 'quick-create',
            code: `import { QuickCreate } from '@/components/company-os';

const { can_create } = usePage().props;
const [menuOpen, setMenuOpen] = useState(false);

const items = [
  { kind: 'contact', label: t('Contact'), icon: Contact, shortcut: 'C', onSelect: () => setDialog('contact') },
  { kind: 'deal', label: t('Deal'), icon: Handshake, onSelect: () => router.visit(deals.create()) },
  { kind: 'project', label: t('Project'), icon: FolderKanban, onSelect: () => router.visit(projects.create()) },
].filter((item) => can_create[item.kind]);

<QuickCreate items={items} label={t('New')} open={menuOpen} onOpenChange={setMenuOpen} />`,
        },
    ],
    props: [
        {
            component: 'QuickCreate',
            rows: [
                { name: 'items', type: 'QuickCreateItem[]', description: 'Already filtered by permission. Empty renders nothing.' },
                { name: 'label', type: 'string', defaultValue: "'New'", description: 'Button text and tooltip.' },
                { name: 'open · onOpenChange', type: 'boolean · (open) => void', description: 'Optional control for the <code>n</code> shortcut.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'N', action: 'Open the menu from anywhere (via useShortcuts).' },
            { keys: '↑ ↓ Enter', action: 'Pick an item.' },
        ],
        notes: [
            'Collapsed sidebar shows the label as a tooltip; the button keeps "New" as its name.',
            'Shortcuts shown in the menu are hints; the key handling lives in <code>useShortcuts</code>.',
        ],
    },
    donts: [
        'No create button in the header. This is the one.',
        'No permission check inside. The page filters with <code>can_create</code>.',
        'No dialog rendered inside the menu. Dialogs live beside it, opened by state, or they unmount with the menu.',
    ],
    faq: [
        { q: 'Dialog or page?', a: 'A record with up to five fields opens a FormDialog in place. More than that visits its create page.' },
    ],
};
