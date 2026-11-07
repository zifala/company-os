import { PlusIcon } from 'lucide-react';
import { DataTable, DateCell, ExportButton, FilterBar, LinkCell, MoneyCell, PageHeader, PersonCell, StatusCell } from '@/components/company-os';
import type { FilterState, Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Deal = {
    id: string;
    name: string;
    company: string;
    stage: { label: string; color: string };
    stage_since: string;
    owner: { name: string; detail: string };
    value: { formatted: string; currency: string };
    expected: { label: string; relative: string };
};

const deals: Deal[] = [
    { id: '1', name: 'Harbour terminal rollout', company: 'Halcyon Freight', stage: { label: 'Proposal', color: 'indigo' }, stage_since: 'Since 28 Oct 2026', owner: { name: 'Hodan Ali', detail: 'Sales' }, value: { formatted: '84,000.00', currency: 'USD' }, expected: { label: '30 Nov 2026', relative: 'in 3 weeks' } },
    { id: '2', name: 'Cold chain audit', company: 'Northwind Trading', stage: { label: 'Qualified', color: 'cyan' }, stage_since: 'Since 2 Nov 2026', owner: { name: 'Mahad Yusuf', detail: 'Sales' }, value: { formatted: '22,500.00', currency: 'USD' }, expected: { label: '15 Dec 2026', relative: 'in 5 weeks' } },
    { id: '3', name: 'Fleet telematics', company: 'Kestrel Logistics', stage: { label: 'Negotiation', color: 'amber' }, stage_since: 'Since 20 Oct 2026', owner: { name: 'Hodan Ali', detail: 'Sales' }, value: { formatted: '61,200.00', currency: 'USD' }, expected: { label: '21 Nov 2026', relative: 'in 2 weeks' } },
    { id: '4', name: 'Store refit, phase 2', company: 'Bluepeak Retail', stage: { label: 'Won', color: 'emerald' }, stage_since: 'Won 1 Nov 2026', owner: { name: 'Ayaan Warsame', detail: 'Delivery' }, value: { formatted: '38,750.00', currency: 'USD' }, expected: { label: '1 Nov 2026', relative: '6 days ago' } },
];

const page: Paginated<Deal> = { data: deals, from: 1, to: 4, total: 37, current_page: 1, last_page: 10, prev_page_url: null, next_page_url: '?page=2' };

const state: FilterState = {
    url: '/blocks',
    filters: { stage: 'open' },
    searchPlaceholder: 'Search deals',
    fields: [
        { key: 'stage', label: 'Stage', inline: true, placeholder: 'All stages', options: [{ value: 'open', label: 'Open' }, { value: 'won', label: 'Won' }, { value: 'lost', label: 'Lost' }] },
        { key: 'owner', label: 'Owner', inline: true, placeholder: 'Anyone', searchable: true, options: [{ value: 'hodan', label: 'Hodan Ali' }, { value: 'mahad', label: 'Mahad Yusuf' }, { value: 'ayaan', label: 'Ayaan Warsame' }] },
        { key: 'company', label: 'Company', placeholder: 'Any company', searchable: true, options: [{ value: '1', label: 'Halcyon Freight' }, { value: '2', label: 'Northwind Trading' }] },
        { key: 'expected', label: 'Expected close', placeholder: 'Any time', options: [{ value: 'month', label: 'This month' }, { value: 'quarter', label: 'This quarter' }] },
    ],
};

export function IndexPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Deals">
                <Button>
                    <PlusIcon /> Create deal
                </Button>
            </PageHeader>
            <FilterBar state={state} end={<ExportButton href="#" />} />
            <DataTable page={page}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Deal</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead>Expected close</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deals.map((deal) => (
                            <TableRow key={deal.id}>
                                <LinkCell value={{ label: deal.name, href: '#', detail: deal.company }} />
                                <StatusCell value={deal.stage} detail={deal.stage_since} />
                                <PersonCell value={deal.owner} />
                                <MoneyCell value={deal.value} />
                                <DateCell value={deal.expected} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DataTable>
        </div>
    );
}
