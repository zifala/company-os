import { RotateCwIcon } from 'lucide-react';
import { CodeCell, DateCell, NumberCell, StatusCell, TextCell } from '@/components/company-os/cells';
import type { Day, Status } from '@/components/company-os/cells';
import { DataTable, TableEmptyRow } from '@/components/company-os/data-table';
import type { PageLabels, Paginated } from '@/components/company-os/data-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type WebhookDelivery = {
    id: string;
    event: { name: string; label: string };
    status: Status;
    attempts: number;
    responseCode: number | null;
    excerpt: string | null;
    createdAt: Day;
    nextAttemptAt: Day;
};

export type WebhookDeliveryLogLabels = {
    event: string;
    status: string;
    attempts: string;
    response: string;
    sent: string;
    next: string;
    resend: string;
    resendFor: (event: string) => string;
    emptyTitle: string;
    emptyMessage: string;
};

export const webhookDeliveryLogLabels: WebhookDeliveryLogLabels = {
    event: 'Event',
    status: 'Status',
    attempts: 'Attempts',
    response: 'Response',
    sent: 'Created',
    next: 'Next attempt',
    resend: 'Resend',
    resendFor: (event) => `Resend ${event}`,
    emptyTitle: 'Nothing delivered yet',
    emptyMessage: 'Send a test event to check the endpoint answers with a 2xx.',
};

export function WebhookDeliveryLog({
    page,
    deliveries,
    canResend,
    resending = null,
    onResend,
    pageLabels,
    labels: custom,
}: {
    page: Paginated<unknown>;
    deliveries: WebhookDelivery[];
    canResend: boolean;
    resending?: string | null;
    onResend: (delivery: WebhookDelivery) => void;
    pageLabels?: PageLabels;
    labels?: Partial<WebhookDeliveryLogLabels>;
}) {
    const labels = { ...webhookDeliveryLogLabels, ...custom };
    const columns = canResend ? 7 : 6;

    return (
        <DataTable page={page} labels={pageLabels}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{labels.event}</TableHead>
                        <TableHead>{labels.status}</TableHead>
                        <TableHead className="text-right">{labels.attempts}</TableHead>
                        <TableHead>{labels.response}</TableHead>
                        <TableHead>{labels.sent}</TableHead>
                        <TableHead>{labels.next}</TableHead>
                        {canResend && <TableHead className="w-24" />}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deliveries.length === 0 && <TableEmptyRow colSpan={columns} title={labels.emptyTitle} message={labels.emptyMessage} />}
                    {deliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                            <TextCell detail={delivery.event.name}>
                                <span className="font-medium text-foreground">{delivery.event.label}</span>
                            </TextCell>
                            <StatusCell value={delivery.status} />
                            <NumberCell value={String(delivery.attempts)} />
                            {delivery.responseCode === null && delivery.excerpt === null ? (
                                <CodeCell value={null} />
                            ) : (
                                <TableCell className="max-w-64">
                                    <span className="grid min-w-0 gap-0.5">
                                        <span className="font-mono text-xs text-foreground">{delivery.responseCode ?? '—'}</span>
                                        {delivery.excerpt && <span className="truncate font-mono text-xs text-muted-foreground" title={delivery.excerpt}>{delivery.excerpt}</span>}
                                    </span>
                                </TableCell>
                            )}
                            <DateCell value={delivery.createdAt} />
                            <DateCell value={delivery.nextAttemptAt} />
                            {canResend && (
                                <TableCell className="text-end">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={resending === delivery.id}
                                        aria-label={labels.resendFor(delivery.event.label)}
                                        onClick={() => onResend(delivery)}
                                    >
                                        <RotateCwIcon /> {labels.resend}
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataTable>
    );
}
