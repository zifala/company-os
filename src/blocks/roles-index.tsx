import { LockIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { ActionsMenu, DataTable, NumberCell, PageHeader, Pill, ReasonDialog, TextCell } from '@/components/company-os';
import type { Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Role = { id: string; name: string; description: string; users: string; permissions: string; locked: boolean };

const roles: Role[] = [
    { id: '1', name: 'Super admin', description: 'Passes every check. Created by a command, never in the UI.', users: '1', permissions: 'All', locked: true },
    { id: '2', name: 'Administrator', description: 'Organization, setup and every module across the firm.', users: '2', permissions: '48', locked: false },
    { id: '3', name: 'Sales manager', description: 'Contacts across the firm, deals in their department.', users: '3', permissions: '14', locked: false },
    { id: '4', name: 'Field agent', description: 'Onboardings they start and the contacts assigned to them.', users: '0', permissions: '6', locked: false },
];

const page: Paginated<Role> = { data: roles, from: 1, to: 4, total: 4, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };

export function RolesIndex() {
    const [deleting, setDeleting] = useState<Role | null>(null);
    const [reason, setReason] = useState('');

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Roles">
                <Button>
                    <PlusIcon /> New role
                </Button>
            </PageHeader>
            <DataTable page={page}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Users</TableHead>
                            <TableHead className="text-right">Permissions</TableHead>
                            <TableHead className="w-12" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TextCell detail={role.description}>
                                    <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                                        {role.name}
                                        {role.locked && <Pill name="Locked" color="slate" />}
                                    </span>
                                </TextCell>
                                <NumberCell value={role.users} />
                                <NumberCell value={role.permissions} />
                                <TextCell>
                                    {role.locked ? (
                                        <span className="inline-flex" title="Locked role">
                                            <LockIcon className="size-4 text-muted-foreground" aria-hidden />
                                            <span className="sr-only">Locked role</span>
                                        </span>
                                    ) : (
                                        <ActionsMenu
                                            items={[
                                                { label: 'Edit role', onSelect: () => undefined },
                                                { label: 'Duplicate role', onSelect: () => undefined },
                                                ...(role.users === '0' ? [{ label: 'Delete role', destructive: true, onSelect: () => { setReason(''); setDeleting(role); } }] : []),
                                            ]}
                                        />
                                    )}
                                </TextCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DataTable>
            <ReasonDialog
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
                title={`Delete ${deleting?.name ?? ''}`}
                consequence="Nobody holds this role, so no one loses access. The audit log keeps the name and your reason."
                confirmLabel="Delete role"
                reason={reason}
                onReasonChange={setReason}
                processing={false}
                onConfirm={() => {
                    setReason('');
                    setDeleting(null);
                }}
            />
        </div>
    );
}
