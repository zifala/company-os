import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { ActionsMenu, DataTable, DateCell, FieldRow, FormDialog, PageHeader, ReasonDialog, SectionLayout, StatusCell, TextCell } from '@/components/company-os';
import type { Paginated } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminPermissions, organizationGroups } from './organization-nav';

type Member = { id: string; name: string; email: string; role: { label: string; color: string }; status: { label: string; color: string }; last_login: { label: string; relative: string } | null };

const members: Member[] = [
    { id: '1', name: 'Ayaan Warsame', email: 'ayaan@halcyon.example', role: { label: 'Administrator', color: 'indigo' }, status: { label: 'Active', color: 'emerald' }, last_login: { label: '7 Nov 2026', relative: '2 hours ago' } },
    { id: '2', name: 'Hodan Ali', email: 'hodan@halcyon.example', role: { label: 'Sales manager', color: 'cyan' }, status: { label: 'Active', color: 'emerald' }, last_login: { label: '6 Nov 2026', relative: 'yesterday' } },
    { id: '3', name: 'Mahad Yusuf', email: 'mahad@halcyon.example', role: { label: 'Member', color: 'slate' }, status: { label: 'Invited', color: 'amber' }, last_login: null },
    { id: '4', name: 'Farah Nur', email: 'farah@halcyon.example', role: { label: 'Member', color: 'slate' }, status: { label: 'Deactivated', color: 'rose' }, last_login: { label: '12 Sep 2026', relative: '8 weeks ago' } },
];

const page: Paginated<Member> = { data: members, from: 1, to: 4, total: 4, current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };
const roles = [{ value: 'admin', label: 'Administrator' }, { value: 'sales', label: 'Sales manager' }, { value: 'member', label: 'Member' }];

export function UsersPage() {
    const [inviting, setInviting] = useState(false);
    const [deactivating, setDeactivating] = useState<Member | null>(null);
    const [reason, setReason] = useState('');

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Users">
                    <Button onClick={() => setInviting(true)}>
                        <PlusIcon /> Invite user
                    </Button>
                </PageHeader>
                <DataTable page={page}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last login</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TextCell detail={member.email}>
                                        <span className="font-semibold text-slate-800">{member.name}</span>
                                    </TextCell>
                                    <StatusCell value={member.role} />
                                    <StatusCell value={member.status} />
                                    <DateCell value={member.last_login} />
                                    <TextCell>
                                        <ActionsMenu items={[{ label: 'Change role', onSelect: () => undefined }, { label: 'Deactivate user', destructive: true, onSelect: () => setDeactivating(member) }]} />
                                    </TextCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </div>
            <FormDialog open={inviting} onOpenChange={setInviting} title="Invite user" submitLabel="Send invitation" processing={false} onSubmit={() => setInviting(false)}>
                <FieldRow id="invite-name" label="Name">
                    <Input id="invite-name" />
                </FieldRow>
                <FieldRow id="invite-email" label="Email">
                    <Input id="invite-email" type="email" />
                </FieldRow>
                <FieldRow id="invite-role" label="Role" hint="You can grant only roles you hold.">
                    <OptionSelect id="invite-role" placeholder="Pick a role" options={roles} />
                </FieldRow>
            </FormDialog>
            <ReasonDialog
                open={deactivating !== null}
                onOpenChange={(open) => !open && setDeactivating(null)}
                title={`Deactivate ${deactivating?.name ?? ''}`}
                consequence="They lose access right away. Open work needs a successor. The audit log keeps who did this and why."
                confirmLabel="Deactivate user"
                reason={reason}
                onReasonChange={setReason}
                processing={false}
                onConfirm={() => {
                    setReason('');
                    setDeactivating(null);
                }}
            />
        </SectionLayout>
    );
}
