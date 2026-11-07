import type { DocEntry } from '../types';

export const setupChecklist: DocEntry = {
    slug: 'setup-checklist',
    name: 'SetupChecklist',
    category: 'setup',
    pieces: [8],
    tagline: 'Steps that tick from real data, each with a link to where it gets done, and one "Finish setup".',
    job: 'Walk the super admin through the first configuration without storing a single tick.',
    tags: ['setup', 'checklist', 'onboarding', 'super admin', 'first run'],
    exports: ['SetupChecklist', 'SetupStep', 'SetupLabels'],
    files: ['components/company-os/setup-checklist.tsx'],
    registryDeps: ['pill'],
    shadcnDeps: ['button'],
    intro: [
        'The server computes every step: <code>done: true</code> from a query, <code>false</code> when the data is missing, <code>null</code> for review-only steps that never tick. Each row shows the state as a pill and one outline button per link into the page that completes it. Nothing blocks "Finish setup".',
        'The home route redirects the super admin here until <code>setup_finished_at</code> is stamped. Step-specific panels (test email, services) render as children under the list.',
    ],
    examples: [
        {
            title: 'First run',
            demoKey: 'setup-checklist-basic',
            code: `import { SetupChecklist } from '@/components/company-os';

<SetupChecklist steps={steps} finishing={form.processing} onFinish={() => form.post(setup.finish().url)} />`,
        },
    ],
    props: [
        {
            component: 'SetupChecklist',
            rows: [
                { name: 'steps', type: 'SetupStep[]', description: '<code>{ key, title, done: boolean | null, links: { label, href }[] }</code>.' },
                { name: 'onFinish · finishing', type: '() => void · boolean', description: 'The finish request.' },
                { name: 'labels', type: 'SetupLabels', description: 'done, todo, review, finish.' },
                { name: 'children', type: 'ReactNode', description: 'Panels between the list and the finish button.' },
            ],
        },
    ],
    a11y: { notes: ['An ordered list; each state is a word in a pill, with the icon as decoration.'] },
    donts: ['No stored "step done" flags. A query never lies.', 'No blocking the finish on review-only steps.', 'No global redirect middleware; only the home route redirects.'],
    faq: [{ q: 'Run it again later?', a: 'Organization → Workspace keeps an "Open setup" link; the page renders the same component.' }],
};
