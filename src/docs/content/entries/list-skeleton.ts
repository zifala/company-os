import type { DocEntry } from '../types';

export const listSkeleton: DocEntry = {
    slug: 'list-skeleton',
    name: 'ListSkeleton',
    category: 'page-kit',
    pieces: [20],
    tagline: 'Placeholder bars for a non-table list while its deferred prop loads.',
    job: 'Hold the space of a list that is still arriving.',
    tags: ['skeleton', 'loading', 'deferred', 'list'],
    exports: ['ListSkeleton'],
    files: ['components/company-os/list-skeleton.tsx'],
    shadcnDeps: ['skeleton'],
    intro: [
        'Rows of pulsing bars at list-row height. It is the <code>fallback</code> of <code>&lt;Deferred&gt;</code> and <code>&lt;WhenVisible&gt;</code> for boards, timelines and cards. Tables use <b>DataTableSkeleton</b>, which keeps the header row.',
        'Skeletons, never spinners inside content. The layout holds its shape so nothing jumps when the rows land.',
    ],
    examples: [
        {
            title: 'Deferred board',
            demoKey: 'list-skeleton-basic',
            code: `import { ListSkeleton, LoadError } from '@/components/company-os';

<Deferred data="groups" fallback={<ListSkeleton />} rescue={<LoadError prop="groups" noun="tasks" />}>
  <TaskBoard columns={groups ?? []} />
</Deferred>`,
        },
    ],
    props: [
        {
            component: 'ListSkeleton',
            rows: [{ name: 'rows', type: 'number', defaultValue: '6', description: 'How many bars.' }],
        },
    ],
    a11y: {
        notes: ['Purely visual; the deferred region announces nothing until real content renders.'],
    },
    donts: ['No spinner in place of a skeleton.', 'No skeleton for a table; use DataTableSkeleton.'],
    faq: [{ q: 'Below the fold?', a: '<code>&lt;WhenVisible&gt;</code> with the same fallback.' }],
};
