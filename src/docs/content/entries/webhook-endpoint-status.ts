import type { DocEntry } from '../types';

export const webhookEndpointStatus: DocEntry = {
    slug: 'webhook-endpoint-status',
    name: 'WebhookEndpointStatus',
    category: 'organization',
    pieces: [22, 16],
    tagline: 'The banner on an endpoint that is failing or off: since when, who turned it off and why, and Enable.',
    job: 'Make the auto-disabled state impossible to miss and one click to undo.',
    tags: ['webhooks', 'disabled', 'failing', 'banner', 'enable'],
    exports: ['WebhookEndpointStatus', 'webhookEndpointStatusLabels', 'WebhookEndpointState', 'WebhookEndpointStatusLabels'],
    files: ['components/company-os/webhook-endpoint-status.tsx'],
    shadcnDeps: ['alert', 'button'],
    intro: [
        'Three states. Healthy renders nothing. Failing (<code>failing_since</code> set) warns that retries continue and the endpoint turns off after <code>DisableAfterFailingDays</code>. Off shows who did it — a person, or the system — with the stored reason and Enable.',
        'Enable clears <code>disabled_at</code> and <code>failing_since</code>. Turning off by hand is a ReasonDialog on the page; the system writes its own reason.',
    ],
    examples: [
        {
            title: 'Turned off by the system',
            demoKey: 'webhook-endpoint-status-off',
            code: `import { WebhookEndpointStatus } from '@/components/company-os';

<WebhookEndpointStatus endpoint={endpoint} canManage={can.manage} processing={enabling} onEnable={enable} />`,
        },
        {
            title: 'Failing, still retrying',
            demoKey: 'webhook-endpoint-status-failing',
            code: `<WebhookEndpointStatus endpoint={{ ...endpoint, active: true, failingSince: '16 Nov 2026' }} canManage onEnable={enable} />`,
        },
    ],
    props: [
        {
            component: 'WebhookEndpointStatus',
            rows: [
                { name: 'endpoint', type: 'WebhookEndpointState', description: '<code>{ active, failingSince, disabledAt, disabledBy, disabledReason }</code>; dates as formatted strings.' },
                { name: 'disableAfterDays', type: 'number', defaultValue: '3', description: 'From <code>WebhookEndpoint::DisableAfterFailingDays</code>.' },
                { name: 'canManage', type: 'boolean', description: 'Shows Enable.' },
                { name: 'processing · onEnable', type: 'boolean · () => void', description: 'Request state and the action.' },
                { name: 'labels', type: 'Partial<WebhookEndpointStatusLabels>', description: 'Titles and lines, functions of the dates.' },
            ],
        },
    ],
    a11y: { notes: ['Rendered as an alert so screen readers announce it on load.'] },
    donts: ['No silent re-enable on the next event. A person turns it back on.', 'No toast-only notice. The creator is notified and the banner stays.'],
    faq: [{ q: 'Do events while it was off get delivered later?', a: 'No. Nothing is queued while off; resend specific deliveries if the receiver needs them.' }],
};
