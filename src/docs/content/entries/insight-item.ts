import type { DocEntry } from '../types';

export const insightItem: DocEntry = {
    slug: 'insight-item',
    name: 'InsightItem',
    category: 'setup',
    pieces: [24, 11],
    tagline: 'One insight: severity, title, body, folded evidence, suggestions you can apply, mark seen, dismiss.',
    job: 'Present one rule signal and let the reader act on it or close it.',
    tags: ['insight', 'signal', 'inbox', 'suggestion', 'evidence'],
    exports: ['InsightItem', 'Insight', 'InsightLabels'],
    files: ['components/company-os/insight-item.tsx'],
    registryDeps: ['pill'],
    shadcnDeps: ['button', 'collapsible'],
    intro: [
        'A rule raises at most one live insight per kind and scope. The item shows its severity pill, the agent and kind, the title and body, a folded list of evidence lines with links to the records, and the suggestions, each with an Apply button that runs the normal Action. "Mark seen" acknowledges; "Dismiss" opens a ReasonDialog on the page and keeps the rule quiet for seven days.',
    ],
    examples: [
        {
            title: 'In the inbox',
            demoKey: 'insight-item-basic',
            code: `import { InsightItem } from '@/components/company-os';

<InsightItem
  insight={insight}
  pending={pending}
  onApply={(index) => router.post(insights.apply(insight.id).url, { index })}
  onAcknowledge={() => router.post(insights.acknowledge(insight.id).url)}
  onDismiss={() => setDismissing(insight)}
/>`,
        },
    ],
    props: [
        {
            component: 'InsightItem',
            rows: [
                { name: 'insight', type: 'Insight', description: 'Severity, status, evidence and suggestions as the server sends them.' },
                { name: 'evidenceOpen', type: 'boolean', defaultValue: 'false', description: 'Start with the evidence unfolded.' },
                { name: 'pending', type: 'number | null', description: 'Index of the suggestion being applied.' },
                { name: 'onApply · onAcknowledge · onDismiss', type: 'functions', description: 'The page\'s requests; dismiss opens the reason dialog.' },
                { name: 'labels', type: 'InsightLabels', description: 'evidence, written, applied, applying, markSeen, dismiss.' },
            ],
        },
    ],
    a11y: { notes: ['Evidence is a native collapsible with an expanded state; suggestions are a list with one button each.'] },
    donts: ['No insight text stored translated; the server renders it for the reader\'s locale.', 'No apply without the suggestion\'s normal Action and audit.', 'No dismiss without a reason.'],
    faq: [{ q: 'Where do insights come from?', a: 'Rule signals on a schedule. The agent layer may word them; the numbers are always cited.' }],
};
