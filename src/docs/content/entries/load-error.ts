import type { DocEntry } from '../types';

export const loadError: DocEntry = {
    slug: 'load-error',
    name: 'LoadError',
    category: 'page-kit',
    pieces: [20],
    tagline: 'The fourth state of a data region: it did not load, and here is the button that tries again.',
    job: 'Say a region failed to load and offer one retry.',
    tags: ['error', 'retry', 'deferred', 'rescue', 'state'],
    exports: ['LoadError'],
    files: ['components/company-os/load-error.tsx'],
    shadcnDeps: ['button'],
    intro: [
        'A rose-tinted line naming the noun that failed and a button that reloads only that prop. It is the <code>rescue</code> of every <code>&lt;Deferred&gt;</code>; without it a failed deferred request leaves the skeleton forever.',
        'Every data region shows four states: loading, empty, error, loaded. This is the error.',
    ],
    examples: [
        {
            title: 'Rescue of a deferred prop',
            demoKey: 'load-error-basic',
            code: `import { LoadError } from '@/components/company-os';

<Deferred data="invoices" fallback={<DataTableSkeleton />} rescue={<LoadError prop="invoices" noun="invoices" />}>
  …
</Deferred>`,
        },
    ],
    props: [
        {
            component: 'LoadError',
            rows: [
                { name: 'noun', type: 'string', description: 'What failed, plural: "invoices".' },
                { name: 'prop', type: 'string', description: 'The page prop to reload. Default retry calls <code>reload({ only: [prop] })</code>.' },
                { name: 'onRetry', type: '() => void', description: 'Replaces the default retry.' },
                { name: 'message · label', type: 'string', description: 'Translated copy. Defaults: "The {noun} did not load." and "Load {noun} again".' },
            ],
        },
    ],
    a11y: {
        notes: ['Plain text plus one button; the button names the object it reloads.'],
    },
    donts: [
        'No "Something went wrong". Name the noun.',
        'No full-page reload. Retry only the prop that failed.',
        'No error code as the message.',
    ],
    faq: [{ q: 'Where does a save error go?', a: 'Under its field (InputError) or in an AlertError at the top of the form. LoadError is for reads.' }],
};
