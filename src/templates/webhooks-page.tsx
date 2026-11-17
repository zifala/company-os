import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { DataTable, DateCell, FieldRow, FormDialog, LinkCell, NumberCell, PageHeader, SecretReveal, SectionLayout, StatusCell, WebhookEventPicker } from '@/components/company-os';
import type { Day, Paginated, Status } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminPermissions, organizationGroups } from './organization-nav';
import { webhookGroups } from './webhook-catalogue';

type Endpoint = { id: string; url: string; events: string; status: Status; detail: string | null; lastDelivery: Day };

const endpoints: Endpoint[] = [
    { id: '1', url: 'https://erp.halcyon.example/hooks/company-os', events: '7', status: { label: 'Active', color: 'emerald' }, detail: null, lastDelivery: { label: '17 Nov 2026, 09:41', relative: '6 minutes ago' } },
    { id: '2', url: 'https://hooks.ledgerline.example/in', events: '3', status: { label: 'Off', color: 'rose' }, detail: 'Turned off after 3 days of failure', lastDelivery: { label: '14 Nov 2026, 02:10', relative: '3 days ago' } },
    { id: '3', url: 'https://automate.example/catch/88213', events: '2', status: { label: 'Failing', color: 'amber' }, detail: 'Failing since 16 Nov 2026', lastDelivery: { label: '17 Nov 2026, 08:00', relative: '2 hours ago' } },
];

const page: Paginated<Endpoint> = { data: endpoints, from: 1, to: 3, total: 3, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };

export function WebhooksPage() {
    const [creating, setCreating] = useState(false);
    const [url, setUrl] = useState('');
    const [events, setEvents] = useState<string[]>(['deal.won', 'deal.lost']);
    const [secret, setSecret] = useState<string | null>(null);

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Webhooks">
                    <Button onClick={() => setCreating(true)}>
                        <PlusIcon /> Add endpoint
                    </Button>
                </PageHeader>
                <DataTable page={page}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Endpoint</TableHead>
                                <TableHead className="text-end">Events</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last delivery</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {endpoints.map((endpoint) => (
                                <TableRow key={endpoint.id}>
                                    <LinkCell value={{ label: endpoint.url, href: '/templates/webhook-endpoint-page' }} />
                                    <NumberCell value={endpoint.events} />
                                    <StatusCell value={endpoint.status} detail={endpoint.detail} />
                                    <DateCell value={endpoint.lastDelivery} />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </div>
            <FormDialog
                open={creating}
                onOpenChange={setCreating}
                title="Add endpoint"
                description="We sign every delivery and send it only to a public address. Adding an endpoint asks for your password."
                submitLabel="Add endpoint"
                onSubmit={() => {
                    setCreating(false);
                    setSecret('whsec_Q8n2vT7mKc4LxR1pZ9aW3eY6uB0sJ5hD2fG8kN4q');
                }}
            >
                <FieldRow id="endpoint-url" label="URL" hint="https only. Redirects are not followed.">
                    <Input id="endpoint-url" type="url" placeholder="https://example.com/hooks" value={url} onChange={(event) => setUrl(event.target.value)} />
                </FieldRow>
                <WebhookEventPicker groups={webhookGroups} value={events} onChange={setEvents} />
            </FormDialog>
            <Dialog open={secret !== null} onOpenChange={(open) => !open && setSecret(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Endpoint added</DialogTitle>
                        <DialogDescription>Verify the X-Webhook-Signature header with this secret: HMAC-SHA256 of the timestamp, a dot, and the raw body.</DialogDescription>
                    </DialogHeader>
                    {secret && <SecretReveal id="webhook-secret" label="Signing secret" value={secret} />}
                    <DialogFooter>
                        <Button onClick={() => setSecret(null)}>I have copied it</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SectionLayout>
    );
}
