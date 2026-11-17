import type { DocEntry } from '../types';

export const webhookDeliveryLog: DocEntry = {
    slug: 'webhook-delivery-log',
    name: 'WebhookDeliveryLog',
    category: 'organization',
    pieces: [22],
    tagline: 'Every delivery as a row: event, status, attempts, response code over its excerpt, next attempt, resend.',
    job: 'Answer "did they get it, and if not why" from the endpoint page.',
    tags: ['webhooks', 'deliveries', 'retry', 'resend', 'log'],
    exports: ['WebhookDeliveryLog', 'webhookDeliveryLogLabels', 'WebhookDelivery', 'WebhookDeliveryLogLabels'],
    files: ['components/company-os/webhook-delivery-log.tsx'],
    registryDeps: ['cells', 'data-table'],
    shadcnDeps: ['table', 'button'],
    intro: [
        'Rows are <code>webhook_deliveries</code>, 25 per page. Status is the <code>WebhookDeliveryStatus</code> label and tone: Pending, Retrying, Delivered, Failed. The excerpt is the first 500 characters the receiver answered, or why nothing was sent.',
        'Resend copies the payload into a new delivery row; the old row stays. The column disappears when the endpoint is off or the viewer lacks <code>integrations.manage</code>.',
    ],
    examples: [
        {
            title: 'On the endpoint page',
            demoKey: 'webhook-delivery-log-basic',
            code: `import { WebhookDeliveryLog } from '@/components/company-os';

<WebhookDeliveryLog
  page={deliveries}
  deliveries={deliveries.data}
  canResend={endpoint.active && can.manage}
  resending={resendingId}
  onResend={(delivery) => router.post(route('organization.integrations.webhooks.deliveries.resend', delivery.id))}
/>`,
        },
        {
            title: 'Nothing sent yet, no permission to resend',
            demoKey: 'webhook-delivery-log-empty',
            code: `<WebhookDeliveryLog page={deliveries} deliveries={[]} canResend={false} onResend={() => undefined} />`,
        },
    ],
    props: [
        {
            component: 'WebhookDeliveryLog',
            rows: [
                { name: 'page', type: 'Paginated<unknown>', description: 'The paginator.' },
                { name: 'deliveries', type: 'WebhookDelivery[]', description: '<code>{ id, event, status, attempts, responseCode, excerpt, createdAt, nextAttemptAt }</code>.' },
                { name: 'canResend', type: 'boolean', description: 'Shows the resend column.' },
                { name: 'resending', type: 'string | null', defaultValue: 'null', description: 'Delivery id in flight; its button disables.' },
                { name: 'onResend', type: '(delivery) => void', description: 'Called with the row.' },
                { name: 'pageLabels', type: 'PageLabels', description: 'Footer and pager copy.' },
                { name: 'labels', type: 'Partial<WebhookDeliveryLogLabels>', description: 'Column heads, resend, empty copy.' },
            ],
        },
    ],
    a11y: { notes: ['Each resend button names its event.', 'The full excerpt is the title of the truncated line.'] },
    donts: ['No payload body in the table. It can hold personal data; open the delivery for it if you must.', 'No retry button that skips the schedule. Resend makes a new row.'],
    faq: [{ q: 'Why does a failed row have no next attempt?', a: 'Eight attempts, or three days failing, and the schedule stops. The endpoint then turns itself off.' }],
};
