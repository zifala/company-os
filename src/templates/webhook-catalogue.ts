import type { WebhookEventGroup } from '@/components/company-os';

export const webhookGroups: WebhookEventGroup[] = [
    {
        key: 'contact',
        label: 'Contacts',
        events: [
            { name: 'contact.created', label: 'Contact created' },
            { name: 'contact.updated', label: 'Contact updated' },
            { name: 'contact.deleted', label: 'Contact deleted' },
        ],
    },
    {
        key: 'deal',
        label: 'Deals',
        events: [
            { name: 'deal.created', label: 'Deal created' },
            { name: 'deal.stage_changed', label: 'Deal moved stage' },
            { name: 'deal.won', label: 'Deal won' },
            { name: 'deal.lost', label: 'Deal lost' },
        ],
    },
    {
        key: 'invoice',
        label: 'Invoices',
        events: [
            { name: 'invoice.issued', label: 'Invoice issued' },
            { name: 'invoice.paid', label: 'Invoice paid' },
            { name: 'invoice.voided', label: 'Invoice voided' },
        ],
    },
];
