import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import {
    DataTable,
    DataTableSkeleton,
    DateCell,
    LinkCell,
    MoneyCell,
    PageHeader,
    PersonCell,
    Pill,
    StatusCell,
    TableEmptyRow,
} from '@/components/company-os';
import type { Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { pageKitDemos2 } from './page-kit-2';

type Invoice = {
    id: string;
    number: string;
    customer: string;
    status: { label: string; color: string };
    due: string;
    owner: { name: string; detail: string };
    total: { formatted: string; currency: string };
    issued: { label: string; relative: string };
};

export const invoices: Invoice[] = [
    { id: '1', number: 'INV-0412', customer: 'Halcyon Freight', status: { label: 'Paid', color: 'emerald' }, due: 'Paid 2 Nov 2026', owner: { name: 'Ayaan Warsame', detail: 'Finance' }, total: { formatted: '18,240.00', currency: 'USD' }, issued: { label: '12 Oct 2026', relative: '4 weeks ago' } },
    { id: '2', number: 'INV-0411', customer: 'Northwind Trading', status: { label: 'Sent', color: 'indigo' }, due: 'Due 20 Nov 2026', owner: { name: 'Hodan Ali', detail: 'Sales' }, total: { formatted: '12,960.00', currency: 'USD' }, issued: { label: '21 Oct 2026', relative: '2 weeks ago' } },
    { id: '3', number: 'INV-0409', customer: 'Kestrel Logistics', status: { label: 'Overdue', color: 'amber' }, due: 'Due 30 Oct 2026', owner: { name: 'Ayaan Warsame', detail: 'Finance' }, total: { formatted: '9,850.00', currency: 'USD' }, issued: { label: '30 Sep 2026', relative: '5 weeks ago' } },
    { id: '4', number: 'INV-0405', customer: 'Bluepeak Retail', status: { label: 'Draft', color: 'slate' }, due: 'Not sent', owner: { name: 'Mahad Yusuf', detail: 'Sales' }, total: { formatted: '6,362.00', currency: 'USD' }, issued: { label: '3 Nov 2026', relative: '4 days ago' } },
];

export const invoicePage: Paginated<Invoice> = {
    data: invoices,
    from: 1,
    to: 4,
    total: 212,
    current_page: 1,
    last_page: 53,
    prev_page_url: null,
    next_page_url: '?page=2',
};

const emptyPage: Paginated<Invoice> = { ...invoicePage, data: [], from: null, to: null, total: 0, last_page: 1, next_page_url: null };

export function InvoiceHead() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Issued</TableHead>
            </TableRow>
        </TableHeader>
    );
}

export function InvoiceRows({ rows }: { rows: Invoice[] }) {
    return (
        <>
            {rows.map((invoice) => (
                <TableRow key={invoice.id}>
                    <LinkCell value={{ label: invoice.number, href: '#', detail: invoice.customer }} />
                    <StatusCell value={invoice.status} detail={invoice.due} />
                    <PersonCell value={invoice.owner} />
                    <MoneyCell value={invoice.total} />
                    <DateCell value={invoice.issued} />
                </TableRow>
            ))}
        </>
    );
}

function PageHeaderIndex() {
    return (
        <PageHeader title="Contacts">
            <Button>
                <PlusIcon /> Create contact
            </Button>
        </PageHeader>
    );
}

function PageHeaderRecord() {
    return (
        <PageHeader title="Halcyon Freight" meta={<Pill name="Active" color="emerald" />}>
            <Button variant="outline">Edit</Button>
            <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreHorizontalIcon />
            </Button>
        </PageHeader>
    );
}

function PillColors() {
    return (
        <div className="flex flex-wrap gap-2">
            <Pill name="Draft" />
            <Pill name="Submitted" color="indigo" />
            <Pill name="In review" color="cyan" />
            <Pill name="Approved" color="emerald" />
            <Pill name="Overdue" color="amber" />
            <Pill name="Rejected" color="rose" />
        </div>
    );
}

function PillCount() {
    return <Pill name="projects" count={3} color="indigo" />;
}

function CellsRow() {
    return (
        <DataTable>
            <Table>
                <InvoiceHead />
                <TableBody>
                    <InvoiceRows rows={invoices.slice(0, 1)} />
                </TableBody>
            </Table>
        </DataTable>
    );
}

export function DataTableRows() {
    return (
        <DataTable page={invoicePage}>
            <Table>
                <InvoiceHead />
                <TableBody>
                    <InvoiceRows rows={invoices} />
                </TableBody>
            </Table>
        </DataTable>
    );
}

function DataTableEmpty() {
    return (
        <DataTable page={emptyPage}>
            <Table>
                <InvoiceHead />
                <TableBody>
                    <TableEmptyRow colSpan={5} title="No invoices yet" message="Create the first one from a won deal.">
                        <Button size="sm">
                            <PlusIcon /> Create invoice
                        </Button>
                    </TableEmptyRow>
                </TableBody>
            </Table>
        </DataTable>
    );
}

export const pageKitDemos: Record<string, ComponentType> = {
    ...pageKitDemos2,
    'page-header-index': PageHeaderIndex,
    'page-header-record': PageHeaderRecord,
    'pill-tones': PillColors,
    'pill-count': PillCount,
    'cells-row': CellsRow,
    'data-table-rows': DataTableRows,
    'data-table-empty': DataTableEmpty,
    'data-table-skeleton': () => <DataTableSkeleton rows={4} />,
};
