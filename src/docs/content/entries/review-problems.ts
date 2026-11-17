import type { DocEntry } from '../types';

export const reviewProblems: DocEntry = {
    slug: 'review-problems',
    name: 'ReviewProblems',
    category: 'setup',
    pieces: [27],
    tagline: 'One row per section: ready, or the problems the server found, with a Fix that jumps to the step.',
    job: 'Show what still blocks a submit or an approve, from the same checks the server runs.',
    tags: ['onboarding', 'review', 'problems', 'validation', 'progress'],
    exports: ['ReviewProblems', 'reviewProblemsLabels', 'ReviewProblemsLabels', 'ReviewSection'],
    files: ['components/company-os/review-problems.tsx'],
    registryDeps: ['pill'],
    shadcnDeps: ['button'],
    intro: [
        'Feed it <code>OnboardingChecks::problems()</code> keyed by section. The review step of the stepper shows it with <code>onFix</code>; the reviewer\'s page shows it on the right as progress, without Fix.',
    ],
    examples: [
        {
            title: 'Review step',
            demoKey: 'review-problems-basic',
            code: `import { ReviewProblems } from '@/components/company-os';

<ReviewProblems sections={review.sections} onFix={setStep} />`,
        },
    ],
    props: [
        {
            component: 'ReviewProblems',
            rows: [
                { name: 'sections', type: 'ReviewSection[]', description: '<code>{ key, label, problems: string[] }</code>.' },
                { name: 'onFix', type: '(key: string) => void', description: 'Shows a Fix button on sections with problems.' },
                { name: 'labels', type: 'ReviewProblemsLabels', description: 'ready, problems(count), fix, allReady.' },
            ],
        },
    ],
    a11y: { notes: ['An ordered list; state is a word in a pill, the icon is decoration.'] },
    donts: ['No checks computed in React. The list is the server\'s.', 'No disabling submit on problems the server will report anyway; let the 422 land under the field.'],
    faq: [],
};
