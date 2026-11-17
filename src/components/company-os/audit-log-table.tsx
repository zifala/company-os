import type { ReactNode } from 'react';
import { DateCell, EmptyValue, PersonCell, TextCell } from '@/components/company-os/cells';
import type { Day, Person, Target } from '@/components/company-os/cells';
import { DataTable, TableEmptyRow } from '@/components/company-os/data-table';
import type { PageLabels, Paginated } from '@/components/company-os/data-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/lib/navigation';

export type AuditEvent = {
    id: string;
    at: Day;
    actor: Person;
    event: { name: string; label: string };
    subject: Target | null;
    via: string | null;
    reason: string | null;
};

export type AuditLogLabels = {
    when: string;
    who: string;
    what: string;
    subject: string;
    reason: string;
    system: string;
    emptyTitle: string;
    emptyMessage: string;
};

export const auditLogLabels: AuditLogLabels = {
    when: 'When',
    who: 'Who',
    what: 'What',
    subject: 'Subject',
    reason: 'Reason',
    system: 'System',
    emptyTitle: 'No events match',
    emptyMessage: 'Widen the dates or clear a filter. Every change still lands here.',
};

export function AuditLogTable({
    page,
    events,
    empty,
    pageLabels,
    labels: custom,
}: {
    page: Paginated<unknown>;
    events: AuditEvent[];
    empty?: ReactNode;
    pageLabels?: PageLabels;
    labels?: Partial<AuditLogLabels>;
}) {
    const labels = { ...auditLogLabels, ...custom };

    return (
        <DataTable page={page} labels={pageLabels}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-44">{labels.when}</TableHead>
                        <TableHead>{labels.who}</TableHead>
                        <TableHead>{labels.what}</TableHead>
                        <TableHead>{labels.subject}</TableHead>
                        <TableHead>{labels.reason}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.length === 0 && (
                        <TableEmptyRow colSpan={5} title={labels.emptyTitle} message={labels.emptyMessage}>
                            {empty}
                        </TableEmptyRow>
                    )}
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <DateCell value={event.at} />
                            <PersonCell value={event.actor ? { name: event.actor.name, detail: event.via ?? event.actor.detail } : { name: labels.system, detail: event.via }} />
                            <TextCell detail={event.event.name}>
                                <span className="font-medium text-slate-800">{event.event.label}</span>
                            </TextCell>
                            <TableCell className="text-sm">
                                {event.subject ? (
                                    <span className="grid min-w-0 gap-0.5">
                                        <Link href={event.subject.href} className="truncate transition-all duration-300 hover:text-primary">
                                            {event.subject.label}
                                        </Link>
                                        {event.subject.detail && <span className="truncate text-xs text-muted-foreground">{event.subject.detail}</span>}
                                    </span>
                                ) : (
                                    <EmptyValue />
                                )}
                            </TableCell>
                            <TableCell className="max-w-72 text-sm whitespace-normal text-slate-700">{event.reason ?? <EmptyValue />}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DataTable>
    );
}
