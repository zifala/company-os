import { ActivityTimeline, DataTable, DateCell, LinkCell, PageHeader, StatTile, StatusCell } from '@/components/company-os';
import type { ActivityEntry } from '@/components/company-os';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const waiting = [
    { id: '1', title: 'Approve PO-2291', detail: 'Purchase order · Kestrel Logistics', status: { label: 'Waiting on you', color: 'amber' }, since: 'Since 5 Nov 2026', due: { label: '8 Nov 2026', relative: 'tomorrow' } },
    { id: '2', title: 'Review onboarding ONB-0009', detail: 'Provider · Daryeel Clinic', status: { label: 'Submitted', color: 'indigo' }, since: 'Since 6 Nov 2026', due: { label: '10 Nov 2026', relative: 'in 3 days' } },
    { id: '3', title: 'Send invoice INV-0413', detail: 'Northwind Trading · 12,960.00 USD', status: { label: 'Draft', color: 'slate' }, since: 'Since 3 Nov 2026', due: { label: '7 Nov 2026', relative: 'today' } },
];

const activity: ActivityEntry[] = [
    { id: '1', kind: 'completed', actor: { name: 'Hodan Ali', initials: 'HA' }, action: 'completed the task', via: 'web', subject: { label: 'ZW-142', url: '#' }, at: '2026-11-07T09:12:00Z', at_label: '7 Nov 2026, 09:12', time_label: '09:12', day_label: 'Today', changes: [{ label: 'Stage', from: 'In review', to: 'Done' }], reason: null },
    { id: '2', kind: 'created', actor: { name: 'Mahad Yusuf', initials: 'MY' }, action: 'created the deal', via: 'web', subject: { label: 'Cold chain audit', url: '#' }, at: '2026-11-07T08:40:00Z', at_label: '7 Nov 2026, 08:40', time_label: '08:40', day_label: 'Today', changes: [], reason: null },
    { id: '3', kind: 'assigned', actor: null, action: 'assigned the follow-up by automation', via: 'automation', subject: { label: 'ZW-139', url: '#' }, at: '2026-11-07T07:00:00Z', at_label: '7 Nov 2026, 07:00', time_label: '07:00', day_label: 'Today', changes: [{ label: 'Assignee', from: null, to: 'Hodan Ali' }], reason: null },
];

export function HomeDashboard() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Home" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatTile raised label="Waiting on you" value="3" href="#" />
                <StatTile raised label="Open deals" value="18" hint="412,800 USD in pipeline" href="#" />
                <StatTile raised label="Overdue invoices" value="3" hint="21,420 USD" href="#" />
                <StatTile raised label="Logged this week" value="31.5" unit="h" />
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <section className="grid gap-3">
                    <h2 className="text-sm font-semibold text-slate-800">Work waiting</h2>
                    <DataTable>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {waiting.map((row) => (
                                    <TableRow key={row.id}>
                                        <LinkCell value={{ label: row.title, href: '#', detail: row.detail }} />
                                        <StatusCell value={row.status} detail={row.since} />
                                        <DateCell value={row.due} />
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DataTable>
                </section>
                <section className="grid gap-3">
                    <h2 className="text-sm font-semibold text-slate-800">Latest activity</h2>
                    <div className="rounded-lg glass p-5">
                        <ActivityTimeline entries={activity} showSubject />
                    </div>
                </section>
            </div>
        </div>
    );
}
