import type { DocEntry } from '../types';

export const onboardingCard: DocEntry = {
    slug: 'onboarding-card',
    name: 'OnboardingCard',
    category: 'setup',
    pieces: [27],
    tagline: 'The side card on a record born from an onboarding: reference, who started it, who approved it, when, and the source.',
    job: 'Show where a relationship record came from.',
    tags: ['onboarding', 'record', 'provenance', 'side card'],
    exports: ['OnboardingCard', 'OnboardingSummary', 'OnboardingLabels'],
    files: ['components/company-os/onboarding-card.tsx'],
    registryDeps: ['detail-card'],
    intro: [
        'Customers, providers and members are born only from an approved onboarding. Their record page carries this compact DetailCard: the reference links back to the onboarding, the rest states who started it, who approved it, the date and the source. Renders nothing when the record predates onboarding.',
    ],
    examples: [
        {
            title: 'On a customer page',
            demoKey: 'onboarding-card-basic',
            code: `import { OnboardingCard } from '@/components/company-os';

<OnboardingCard onboarding={customer.onboarding} />`,
        },
    ],
    props: [
        {
            component: 'OnboardingCard',
            rows: [
                { name: 'onboarding', type: 'OnboardingSummary | null', description: '<code>{ reference, href, started_by, approved_by, approved_at, source, referrer }</code>.' },
                { name: 'labels', type: 'OnboardingLabels', description: 'Card title and the six row labels.' },
            ],
        },
    ],
    a11y: { notes: ['Inherits the DetailCard <code>&lt;dl&gt;</code>; the reference is a link.'] },
    donts: ['No edit controls; provenance is history.', 'No onboarding card on records that have no onboarding.'],
    faq: [{ q: 'Where is the reason for a send-back?', a: 'On the onboarding page itself, read from the latest activity entry.' }],
};
