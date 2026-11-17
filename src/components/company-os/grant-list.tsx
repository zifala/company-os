import { useState } from 'react';
import { DateCell, PersonCell, StatusCell, TextCell } from '@/components/company-os/cells';
import type { Day, Person } from '@/components/company-os/cells';
import { DataTable, TableEmptyRow } from '@/components/company-os/data-table';
import { ReasonDialog } from '@/components/company-os/reason-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type Grant = {
    id: string;
    page: { key: string; label: string; detail?: string | null };
    grantedBy: Person;
    grantedAt: Day;
    revokedAt: Day;
    revokedBy?: string | null;
    revokeReason?: string | null;
};

export type GrantListLabels = {
    page: string;
    grantedBy: string;
    grantedAt: string;
    state: string;
    active: string;
    revoked: string;
    revokedDetail: (by: string | null | undefined, reason: string | null | undefined) => string | null;
    revoke: string;
    revokeTitle: (page: string) => string;
    revokeConsequence: (person: string) => string;
    emptyTitle: string;
    emptyMessage: string;
};

export const grantListLabels: GrantListLabels = {
    page: 'Page',
    grantedBy: 'Granted by',
    grantedAt: 'Granted',
    state: 'State',
    active: 'Active',
    revoked: 'Revoked',
    revokedDetail: (by, reason) => [by, reason].filter(Boolean).join(' · ') || null,
    revoke: 'Revoke',
    revokeTitle: (page) => `Revoke ${page}`,
    revokeConsequence: (person) => `${person} loses the page from their sidebar and gets a 403 on its next request. The grant stays in the list as revoked.`,
    emptyTitle: 'No pages granted',
    emptyMessage: 'Roles cover everything this person reaches. Grant a page to add one without changing their role.',
};

export function GrantList({
    person,
    grants,
    canRevoke,
    processing = false,
    errors,
    onRevoke,
    labels: custom,
}: {
    person: string;
    grants: Grant[];
    canRevoke: (grant: Grant) => boolean;
    processing?: boolean;
    errors?: { reason?: string };
    onRevoke: (grant: Grant, reason: string, done: () => void) => void;
    labels?: Partial<GrantListLabels>;
}) {
    const labels = { ...grantListLabels, ...custom };
    const [revoking, setRevoking] = useState<Grant | null>(null);
    const [reason, setReason] = useState('');
    const close = () => {
        setRevoking(null);
        setReason('');
    };

    return (
        <>
            <DataTable>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{labels.page}</TableHead>
                            <TableHead>{labels.grantedBy}</TableHead>
                            <TableHead>{labels.grantedAt}</TableHead>
                            <TableHead>{labels.state}</TableHead>
                            <TableHead className="w-24" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grants.length === 0 && <TableEmptyRow colSpan={5} title={labels.emptyTitle} message={labels.emptyMessage} />}
                        {grants.map((grant) => {
                            const revoked = grant.revokedAt !== null;

                            return (
                                <TableRow key={grant.id} className={revoked ? 'text-muted-foreground' : undefined}>
                                    <TextCell detail={grant.page.detail}>
                                        <span className={revoked ? 'line-through' : 'font-medium text-slate-800'}>{grant.page.label}</span>
                                    </TextCell>
                                    <PersonCell value={grant.grantedBy} />
                                    <DateCell value={grant.grantedAt} />
                                    <StatusCell
                                        value={revoked ? { label: labels.revoked, color: 'slate' } : { label: labels.active, color: 'emerald' }}
                                        detail={revoked ? labels.revokedDetail(grant.revokedBy, grant.revokeReason) : null}
                                    />
                                    <TableCell className="text-right">
                                        {!revoked && canRevoke(grant) && (
                                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRevoking(grant)}>
                                                {labels.revoke}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </DataTable>
            <ReasonDialog
                open={revoking !== null}
                onOpenChange={(open) => !open && close()}
                title={labels.revokeTitle(revoking?.page.label ?? '')}
                consequence={labels.revokeConsequence(person)}
                confirmLabel={labels.revoke}
                reason={reason}
                onReasonChange={setReason}
                errors={errors}
                processing={processing}
                onConfirm={() => revoking && onRevoke(revoking, reason, close)}
            />
        </>
    );
}
