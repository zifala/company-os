import type { DocEntry } from '../types';

export const webhookEventPicker: DocEntry = {
    slug: 'webhook-event-picker',
    name: 'WebhookEventPicker',
    category: 'organization',
    pieces: [22, 3],
    tagline: 'The event catalogue as checkboxes, grouped by noun, with a tri-state box per group and the raw name under each label.',
    job: 'Subscribe an endpoint to exactly the catalogue events it needs.',
    tags: ['webhooks', 'events', 'catalogue', 'subscribe', 'checkbox'],
    exports: ['WebhookEventPicker', 'webhookEventPickerLabels', 'WebhookEvent', 'WebhookEventGroup', 'WebhookEventPickerLabels'],
    files: ['components/company-os/webhook-event-picker.tsx'],
    shadcnDeps: ['checkbox'],
    intro: [
        'Groups come from <code>WebhookEvents::all()</code>, split on the prefix before the first dot. The raw name is shown because that is what the receiver switches on.',
        'The store request validates each name with <code>Rule::in(WebhookEvents::all())</code> and needs at least one.',
    ],
    examples: [
        {
            title: 'In the create dialog',
            demoKey: 'webhook-event-picker-basic',
            code: `import { WebhookEventPicker } from '@/components/company-os';

<WebhookEventPicker groups={catalogue} value={form.data.events} onChange={(events) => form.setData('events', events)} />`,
        },
    ],
    props: [
        {
            component: 'WebhookEventPicker',
            rows: [
                { name: 'groups', type: 'WebhookEventGroup[]', description: '<code>{ key, label, events: { name, label }[] }</code>.' },
                { name: 'value · onChange', type: 'string[]', description: 'Selected event names.' },
                { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Locks every box.' },
                { name: 'labels', type: 'Partial<WebhookEventPickerLabels>', description: 'Group toggle name and the count.' },
            ],
        },
    ],
    a11y: {
        keyboard: [{ keys: 'Space', action: 'Toggle the focused event or group' }],
        notes: ['Each group is a fieldset; the group box reports mixed when some events are on.'],
    },
    donts: ['No wildcard subscription. New events are opted into, so a receiver never gets a shape it has not seen.', 'No free-text event names.'],
    faq: [{ q: 'Where is webhook.test?', a: 'Not in the catalogue. Send test always uses it, whatever the endpoint subscribes to.' }],
};
