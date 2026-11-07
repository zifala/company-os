import { useState } from 'react';
import { ConfirmDialog, DataTable, DateCell, FilterBar, NumberCell, PageHeader, StatusCell, TextCell } from '@/components/company-os';
import type { FilterState, Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Trashed = { id: string; label: string; context: string; type: { label: string; color: string }; deleted: { label: string; relative: string }; by: string; reason: string; days_left: string };

const rows: Trashed[] = [
    { id: '1', label: 'Scope v2.pdf', context: 'Harbour terminal rollout', type: { label: 'Document', color: 'cyan' }, deleted: { label: '6 Nov 2026', relative: 'yesterday' }, by: 'Mahad Yusuf', reason: 'Superseded by Scope v3; the client signed the new version.', days_left: '29' },
    { id: '2', label: 'Duplicate of Halcyon Freight', context: 'Companies', type: { label: 'Company', color: 'indigo' }, deleted: { label: '2 Nov 2026', relative: '5 days ago' }, by: 'Hodan Ali', reason: 'Created twice during import.', days_left: '25' },
    { id: '3', label: 'ZW-118 Old packaging spec', context: 'Store refit, phase 2', type: { label: 'Task', color: 'slate' }, deleted: { label: '14 Oct 2026', relative: '3 weeks ago' }, by: 'Ayaan Warsame', reason: 'Out of scope after the phase 2 re-plan.', days_left: '6' },
];

const page: Paginated<Trashed> = { data: rows, from: 1, to: 3, total: 3, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };

const state: FilterState = {
    url: '/templates/trash-page',
    filters: {},
    fields: [{ key: 'type', label: 'Type', inline: true, placeholder: 'All types', options: [{ value: 'document', label: 'Documents' }, { value: 'company', label: 'Companies' }, { value: 'task', label: 'Tasks' }] }],
};

export function TrashPage() {
    const [restoring, setRestoring] = useState<Trashed | null>(null);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Trash" />
            <FilterBar state={state} />
            <DataTable page={page}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Deleted</TableHead>
                            <TableHead>By</TableHead>
                            <TableHead className="text-right">Days left</TableHead>
                            <TableHead className="w-28" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TextCell detail={row.context}>
                                    <span className="font-semibold text-slate-800">{row.label}</span>
                                </TextCell>
                                <StatusCell value={row.type} />
                                <DateCell value={row.deleted} />
                                <TextCell detail={row.reason}>{row.by}</TextCell>
                                <NumberCell value={row.days_left} />
                                <TextCell>
                                    <Button size="sm" variant="outline" onClick={() => setRestoring(row)}>
                                        Restore
                                    </Button>
                                </TextCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DataTable>
            <ConfirmDialog
                open={restoring !== null}
                onOpenChange={(open) => !open && setRestoring(null)}
                title={`Restore ${restoring?.label ?? ''}`}
                consequence="It returns to where it was. Nothing is re-sent and no automation runs again."
                confirmLabel="Restore item"
                destructive={false}
                processing={false}
                onConfirm={() => setRestoring(null)}
            />
        </div>
    );
}
