import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldRow, FormDialog, GrantList, PageHeader, Pill, SectionLayout, TabNav } from '@/components/company-os';
import type { Grant } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { OptionSelect } from '@/components/ui/option-select';
import { adminPermissions, organizationGroups } from './organization-nav';

const initial: Grant[] = [
    {
        id: '1',
        page: { key: 'reports.margins', label: 'Margins report', detail: 'Reports' },
        grantedBy: { name: 'Ayaan Warsame', detail: 'Administrator' },
        grantedAt: { label: '17 Nov 2026', relative: 'today' },
        revokedAt: null,
    },
    {
        id: '2',
        page: { key: 'finance.payments', label: 'Payments', detail: 'Finance' },
        grantedBy: { name: 'Farah Nur', detail: 'Finance lead' },
        grantedAt: { label: '2 Oct 2026', relative: '6 weeks ago' },
        revokedAt: null,
    },
    {
        id: '3',
        page: { key: 'setup.price_lists', label: 'Price lists', detail: 'Setup' },
        grantedBy: { name: 'Ayaan Warsame', detail: 'Administrator' },
        grantedAt: { label: '4 Aug 2026', relative: '3 months ago' },
        revokedAt: { label: '1 Sep 2026', relative: '11 weeks ago' },
        revokedBy: 'Ayaan Warsame',
        revokeReason: 'Price review finished.',
    },
];

// Only pages the granter holds themselves are offered.
const grantable = [
    { value: 'reports.pipeline', label: 'Reports · Pipeline' },
    { value: 'reports.margins', label: 'Reports · Margins' },
    { value: 'setup.price_lists', label: 'Setup · Price lists' },
];

const held = new Set(['reports.pipeline', 'reports.margins', 'setup.price_lists']);

export function GrantsPage() {
    const [grants, setGrants] = useState(initial);
    const [granting, setGranting] = useState(false);
    const [page, setPage] = useState('');

    return (
        <SectionLayout title="Organization" groups={organizationGroups} permissions={adminPermissions}>
            <div className="flex flex-col gap-6">
                <PageHeader title="Hodan Ali" meta={<Pill name="Sales manager" color="cyan" />}>
                    <Button onClick={() => setGranting(true)}>
                        <PlusIcon /> Grant a page
                    </Button>
                </PageHeader>
                <TabNav
                    label="User sections"
                    tabs={[
                        { label: 'Profile', href: '/templates/users-page' },
                        { label: 'Access', href: '/templates/roles-page' },
                        { label: 'Grants', href: '/templates/grants-page', count: grants.filter((grant) => grant.revokedAt === null).length },
                    ]}
                />
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Grants add a page to one person on top of their role, without a new role. You can grant only pages you hold, and revoking asks for a reason.
                </p>
                <GrantList
                    person="Hodan Ali"
                    grants={grants}
                    canRevoke={(grant) => held.has(grant.page.key)}
                    onRevoke={(grant, reason, done) => {
                        setGrants(grants.map((row) => (row.id === grant.id ? { ...row, revokedAt: { label: '17 Nov 2026', relative: 'today' }, revokedBy: 'Ayaan Warsame', revokeReason: reason } : row)));
                        done();
                    }}
                />
            </div>
            <FormDialog
                open={granting}
                onOpenChange={setGranting}
                title="Grant a page to Hodan Ali"
                description="The page appears in their sidebar on their next request. The grant is audited with your name."
                submitLabel="Grant page"
                onSubmit={() => setGranting(false)}
            >
                <FieldRow id="grant-page" label="Page" hint="Only pages you hold are listed.">
                    <OptionSelect id="grant-page" options={grantable} placeholder="Choose a page" value={page} onValueChange={setPage} />
                </FieldRow>
            </FormDialog>
        </SectionLayout>
    );
}
