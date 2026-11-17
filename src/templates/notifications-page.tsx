import { CheckCheckIcon } from 'lucide-react';
import { DataTable, DateCell, FilterBar, PageHeader, StatusCell, TextCell } from '@/components/company-os';
import type { FilterState, Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';

type Row = { id: string; message: string; subject: string; url: string; event: { label: string; color: string }; channels: string; read: boolean; at: { label: string; relative: string } };

const rows: Row[] = [
    { id: '1', message: 'Hodan Ali assigned ZW-142 to you', subject: 'Task · Harbour terminal rollout', url: '#', event: { label: 'Assigned', color: 'indigo' }, channels: 'In-app · Email', read: false, at: { label: '7 Nov 2026, 09:12', relative: '12 minutes ago' } },
    { id: '2', message: 'Mahad Yusuf mentioned you on Cold chain audit', subject: 'Deal · Kestrel Logistics', url: '#', event: { label: 'Mentioned', color: 'cyan' }, channels: 'In-app · Email', read: false, at: { label: '7 Nov 2026, 08:40', relative: '44 minutes ago' } },
    { id: '3', message: 'Ayaan Warsame changed 12 tasks: ZW-120, ZW-121, ZW-124, ZW-127, ZW-130 and 7 more', subject: 'Digest · Store refit, phase 2', url: '#', event: { label: 'Bulk change', color: 'slate' }, channels: 'In-app', read: true, at: { label: '6 Nov 2026, 16:05', relative: 'yesterday' } },
    { id: '4', message: 'INV-0409 for Kestrel Logistics is due tomorrow', subject: 'Invoice · 9,850.00 USD', url: '#', event: { label: 'Reminder', color: 'amber' }, channels: 'In-app · Email', read: true, at: { label: '6 Nov 2026, 07:00', relative: 'yesterday' } },
];

const page: Paginated<Row> = { data: rows, from: 1, to: 4, total: 4, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };

const state: FilterState = {
    url: '/templates/notifications-page',
    filters: {},
    fields: [
        { key: 'event', label: 'Event', inline: true, placeholder: 'All events', options: [{ value: 'assigned', label: 'Assigned' }, { value: 'mentioned', label: 'Mentioned' }, { value: 'bulk', label: 'Bulk change' }, { value: 'reminder', label: 'Reminder' }] },
        { key: 'state', label: 'State', inline: true, placeholder: 'Any state', options: [{ value: 'unread', label: 'Unread' }, { value: 'read', label: 'Read' }] },
    ],
};

export function NotificationsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Notifications">
                <Button variant="outline">
                    <CheckCheckIcon /> Mark all read
                </Button>
            </PageHeader>
            <FilterBar state={state} />
            <DataTable page={page}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Notification</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Channels</TableHead>
                            <TableHead>Received</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TextCell detail={row.subject}>
                                    <Link href={row.url} className={cn('inline-flex items-center gap-2 hover:text-primary hover:underline', row.read ? 'text-muted-foreground' : 'font-semibold text-foreground')}>
                                        {!row.read && <span aria-label="Unread" className="size-2 shrink-0 rounded-full bg-primary" />}
                                        {row.message}
                                    </Link>
                                </TextCell>
                                <StatusCell value={row.event} />
                                <TextCell>{row.channels}</TextCell>
                                <DateCell value={row.at} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DataTable>
        </div>
    );
}
