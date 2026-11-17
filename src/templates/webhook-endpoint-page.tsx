import { SendIcon } from 'lucide-react';
import { useState } from 'react';
import { ActionsMenu, DetailCard, PageHeader, Pill, ReasonDialog, SecretReveal, SectionLayout, WebhookDeliveryLog, WebhookEndpointStatus } from '@/components/company-os';
import type { Paginated, WebhookDelivery, WebhookEndpointState } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { adminPermissions, organizationGroups } from './organization-nav';

const delivered = { label: 'Delivered', color: 'emerald' };
const failed = { label: 'Failed', color: 'rose' };
const retrying = { label: 'Retrying', color: 'amber' };

const deliveries: WebhookDelivery[] = [
    { id: 'd7', event: { name: 'invoice.paid', label: 'Invoice paid' }, status: failed, attempts: 5, responseCode: 503, excerpt: '<html><body>Service Unavailable</body></html>', createdAt: { label: '14 Nov 2026, 02:10', relative: '3 days ago' }, nextAttemptAt: null },
    { id: 'd6', event: { name: 'invoice.issued', label: 'Invoice issued' }, status: failed, attempts: 6, responseCode: null, excerpt: 'Connection timed out after 10 seconds', createdAt: { label: '13 Nov 2026, 16:44', relative: '4 days ago' }, nextAttemptAt: null },
    { id: 'd5', event: { name: 'invoice.voided', label: 'Invoice voided' }, status: retrying, attempts: 2, responseCode: 500, excerpt: '{"error":"internal"}', createdAt: { label: '13 Nov 2026, 11:02', relative: '4 days ago' }, nextAttemptAt: { label: '13 Nov 2026, 11:08', relative: '4 days ago' } },
    { id: 'd4', event: { name: 'webhook.test', label: 'Test event' }, status: delivered, attempts: 1, responseCode: 200, excerpt: 'ok', createdAt: { label: '2 Nov 2026, 10:15', relative: '2 weeks ago' }, nextAttemptAt: null },
];

const page: Paginated<WebhookDelivery> = { data: deliveries, from: 1, to: 4, total: 41, current_page: 1, last_page: 2, prev_page_url: null, next_page_url: '?page=2' };

export function WebhookEndpointPage() {
    const [endpoint, setEndpoint] = useState<WebhookEndpointState>({
        active: false,
        failingSince: '11 Nov 2026',
        disabledAt: '14 Nov 2026, 03:00',
        disabledBy: null,
        disabledReason: 'Every delivery failed for 3 days.',
    });
    const [disabling, setDisabling] = useState(false);
    const [reason, setReason] = useState('');
    const [secret, setSecret] = useState<string | null>(null);

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="hooks.ledgerline.example/in" meta={<Pill name={endpoint.active ? 'Active' : 'Off'} color={endpoint.active ? 'emerald' : 'rose'} />}>
                    <Button variant="outline" disabled={!endpoint.active}>
                        <SendIcon /> Send test
                    </Button>
                    <ActionsMenu
                        items={[
                            { label: 'Rotate secret', onSelect: () => setSecret('whsec_b3Hq9Lw2Tz7Xc1Vn5Mk8Rp4Ys6Da0Fg2Je9Ui3Ok') },
                            ...(endpoint.active ? [{ label: 'Turn off', destructive: true, onSelect: () => setDisabling(true) }] : []),
                        ]}
                    />
                </PageHeader>
                <WebhookEndpointStatus endpoint={endpoint} canManage onEnable={() => setEndpoint({ active: true, failingSince: null, disabledAt: null, disabledBy: null, disabledReason: null })} />
                {secret && <SecretReveal id="rotated-secret" label="New signing secret" value={secret} hint="The old secret stopped working. Update your verifier, then copy it now: it is shown once." />}
                <DetailCard
                    title="Endpoint"
                    details={[
                        { label: 'URL', value: <span className="font-mono text-xs">https://hooks.ledgerline.example/in</span> },
                        { label: 'Events', value: 'invoice.issued · invoice.paid · invoice.voided' },
                        { label: 'Added', value: '2 Nov 2026 by Ayaan Warsame' },
                        { label: 'Retries', value: '8 attempts over about 3 days, then failed' },
                    ]}
                />
                <WebhookDeliveryLog page={page} deliveries={deliveries} canResend={endpoint.active} onResend={() => undefined} />
            </div>
            <ReasonDialog
                open={disabling}
                onOpenChange={setDisabling}
                title="Turn off this endpoint"
                consequence="Nothing is sent while it is off; events that happen meanwhile are not queued for later. The reason goes to the audit log."
                confirmLabel="Turn off"
                reason={reason}
                onReasonChange={setReason}
                onConfirm={() => {
                    setEndpoint({ ...endpoint, active: false, disabledAt: '17 Nov 2026, 09:50', disabledBy: 'Ayaan Warsame', disabledReason: reason });
                    setReason('');
                    setDisabling(false);
                }}
            />
        </SectionLayout>
    );
}
