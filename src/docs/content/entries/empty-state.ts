import type { DocEntry } from '../types';

export const emptyState: DocEntry = {
    slug: 'empty-state',
    name: 'EmptyState',
    category: 'page-kit',
    pieces: [20],
    tagline: 'An icon chip, why the region is empty, and the first action. For regions that are not tables.',
    job: 'Say why a region is empty and what fills it.',
    tags: ['empty', 'first use', 'no results', 'state'],
    exports: ['EmptyState'],
    files: ['components/company-os/empty-state.tsx'],
    intro: [
        'A glass panel with an icon chip, a title that says why the region is empty, and a message that names what fills it. Children hold the first action when the user may take it; otherwise the message says who can.',
        'Three empties are three different messages: first use ("No projects yet"), no results ("No projects match these filters"), and no permission ("Ask an admin for access to projects"). Inside a table use <b>TableEmptyRow</b> instead, so the headers stay and the reader sees the shape the data will take.',
    ],
    examples: [
        {
            title: 'First use with an action',
            demoKey: 'empty-state-first',
            code: `import { EmptyState } from '@/components/company-os';

<EmptyState icon={FolderKanbanIcon} title="No projects yet" message="Projects group tasks, documents and time for one piece of work.">
  {can.create && <Button><PlusIcon /> Create project</Button>}
</EmptyState>`,
        },
        {
            title: 'Without permission',
            description: 'The message names who can add one; no button.',
            demoKey: 'empty-state-permission',
            code: `<EmptyState icon={LockIcon} title="No access to invoices" message="Ask a finance manager to grant Invoices · view." />`,
        },
    ],
    props: [
        {
            component: 'EmptyState',
            rows: [
                { name: 'icon', type: 'LucideIcon', description: 'Rendered in the primary tint chip.' },
                { name: 'title', type: 'string', description: 'Why it is empty.' },
                { name: 'message', type: 'string', description: 'What fills it, or who can.' },
                { name: 'children', type: 'ReactNode', description: 'The first action, or active filter chips.' },
            ],
        },
    ],
    a11y: {
        notes: [
            'The icon is decorative; the title and message carry the information.',
            'The action is a real button or link with the verb and the object in its label.',
        ],
    },
    donts: [
        'No EmptyState in place of a table. Keep the table, use TableEmptyRow.',
        'No "Nothing here" or "No data". Say why and what fills it.',
        'No illustration, no mascot.',
        'No explanation paragraphs anywhere else on the page; the empty state is where explanation lives.',
    ],
    faq: [
        { q: 'Board or timeline empty?', a: 'EmptyState. Those are not tables.' },
        { q: 'Message with a link?', a: 'The message is a string; put a text link in children when the place that fills the list is elsewhere (triage, import).' },
    ],
};
