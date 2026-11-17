import type { ComponentType } from 'react';
import { useState } from 'react';
import { CalendarFeedCard, GrantList, WebhookDeliveryLog, WebhookEndpointStatus } from '@/components/company-os';
import type { Grant, Paginated, WebhookDelivery } from '@/components/company-os';

const deliveries: WebhookDelivery[] = [
    { id: 'd3', event: { name: 'invoice.paid', label: 'Invoice paid' }, status: { label: 'Retrying', color: 'amber' }, attempts: 3, responseCode: 503, excerpt: 'Service Unavailable', createdAt: { label: '17 Nov 2026, 08:00', relative: '2 hours ago' }, nextAttemptAt: { label: '17 Nov 2026, 10:30', relative: 'in 20 minutes' } },
    { id: 'd2', event: { name: 'deal.won', label: 'Deal won' }, status: { label: 'Delivered', color: 'emerald' }, attempts: 1, responseCode: 204, excerpt: null, createdAt: { label: '16 Nov 2026, 15:22', relative: 'yesterday' }, nextAttemptAt: null },
    { id: 'd1', event: { name: 'invoice.issued', label: 'Invoice issued' }, status: { label: 'Failed', color: 'rose' }, attempts: 8, responseCode: null, excerpt: 'Blocked: the host resolved to a private address', createdAt: { label: '12 Nov 2026, 09:00', relative: '5 days ago' }, nextAttemptAt: null },
];

const page: Paginated<unknown> = { data: [], from: 1, to: 3, total: 3, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };

function WebhookDeliveryLogDemo() {
    const [resending, setResending] = useState<string | null>(null);

    return (
        <WebhookDeliveryLog
            page={page}
            deliveries={deliveries}
            canResend
            resending={resending}
            onResend={(delivery) => {
                setResending(delivery.id);
                window.setTimeout(() => setResending(null), 800);
            }}
        />
    );
}

function WebhookDeliveryLogEmptyDemo() {
    return <WebhookDeliveryLog page={{ ...page, from: null, to: null, total: 0 }} deliveries={[]} canResend={false} onResend={() => undefined} />;
}

const off = { active: false, failingSince: '11 Nov 2026', disabledAt: '14 Nov 2026, 03:00', disabledBy: null, disabledReason: 'Every delivery failed for 3 days.' };

function WebhookEndpointStatusOffDemo() {
    return (
        <div className="max-w-2xl">
            <WebhookEndpointStatus endpoint={off} canManage onEnable={() => undefined} />
        </div>
    );
}

function WebhookEndpointStatusReadOnlyDemo() {
    return (
        <div className="max-w-2xl">
            <WebhookEndpointStatus endpoint={{ ...off, disabledBy: 'Farah Nur', disabledReason: 'Ledgerline is moving hosts this week.' }} canManage={false} onEnable={() => undefined} />
        </div>
    );
}

function WebhookEndpointStatusFailingDemo() {
    return (
        <div className="max-w-2xl">
            <WebhookEndpointStatus endpoint={{ ...off, active: true, failingSince: '16 Nov 2026', disabledAt: null, disabledReason: null }} canManage onEnable={() => undefined} />
        </div>
    );
}

const grants: Grant[] = [
    { id: '1', page: { key: 'reports.margins', label: 'Margins report', detail: 'Reports' }, grantedBy: { name: 'Ayaan Warsame', detail: 'Administrator' }, grantedAt: { label: '17 Nov 2026', relative: 'today' }, revokedAt: null },
    { id: '2', page: { key: 'finance.payments', label: 'Payments', detail: 'Finance' }, grantedBy: { name: 'Farah Nur', detail: 'Finance lead' }, grantedAt: { label: '2 Oct 2026', relative: '6 weeks ago' }, revokedAt: null },
    { id: '3', page: { key: 'setup.price_lists', label: 'Price lists', detail: 'Setup' }, grantedBy: { name: 'Ayaan Warsame', detail: 'Administrator' }, grantedAt: { label: '4 Aug 2026', relative: '3 months ago' }, revokedAt: { label: '1 Sep 2026', relative: '11 weeks ago' }, revokedBy: 'Ayaan Warsame', revokeReason: 'Price review finished.' },
];

function GrantListDemo() {
    const [rows, setRows] = useState(grants);
    const [processing, setProcessing] = useState(false);

    return (
        <GrantList
            person="Hodan Ali"
            grants={rows}
            canRevoke={(grant) => grant.page.key !== 'finance.payments'}
            processing={processing}
            onRevoke={(grant, reason, done) => {
                setProcessing(true);
                window.setTimeout(() => {
                    setRows((current) => current.map((row) => (row.id === grant.id ? { ...row, revokedAt: { label: '17 Nov 2026', relative: 'today' }, revokedBy: 'You', revokeReason: reason } : row)));
                    setProcessing(false);
                    done();
                }, 600);
            }}
        />
    );
}

function GrantListEmptyDemo() {
    return <GrantList person="Mahad Yusuf" grants={[]} canRevoke={() => false} onRevoke={() => undefined} />;
}

function CalendarFeedCardDemo() {
    const [feed, setFeed] = useState<{ active: boolean; url: string | null }>({ active: false, url: null });
    const [processing, setProcessing] = useState(false);
    const settle = (next: { active: boolean; url: string | null }) => {
        setProcessing(true);
        window.setTimeout(() => {
            setFeed(next);
            setProcessing(false);
        }, 600);
    };

    return (
        <div className="max-w-xl">
            <CalendarFeedCard
                active={feed.active}
                url={feed.url}
                processing={processing}
                onCreate={() => settle({ active: true, url: 'https://app.halcyon.example/calendar/feed/r8Kd2QpX7vLm4Tn9Wc1Zb6Hs3Gy5Ja0Fe8Ui2Ow7.ics' })}
                onRevoke={() => settle({ active: false, url: null })}
            />
        </div>
    );
}

export const organizationDemos2: Record<string, ComponentType> = {
    'webhook-delivery-log-basic': WebhookDeliveryLogDemo,
    'webhook-delivery-log-empty': WebhookDeliveryLogEmptyDemo,
    'webhook-endpoint-status-read-only': WebhookEndpointStatusReadOnlyDemo,
    'webhook-endpoint-status-off': WebhookEndpointStatusOffDemo,
    'webhook-endpoint-status-failing': WebhookEndpointStatusFailingDemo,
    'grant-list-basic': GrantListDemo,
    'grant-list-empty': GrantListEmptyDemo,
    'calendar-feed-card-basic': CalendarFeedCardDemo,
};
