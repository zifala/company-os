import { FolderKanbanIcon, LockIcon, PlusIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { toast } from 'sonner';
import {
    ActionsMenu,
    ActivityTimeline,
    AlertError,
    DetailCard,
    EmptyState,
    FieldRow,
    FilterBar,
    FormCancel,
    FormLayout,
    FormSection,
    ListSkeleton,
    LoadError,
    StatTile,
    TabNav,
} from '@/components/company-os';
import type { ActivityEntry, FilterState } from '@/components/company-os';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';

const owners = [
    { value: 'ayaan', label: 'Ayaan Warsame' },
    { value: 'hodan', label: 'Hodan Ali' },
    { value: 'mahad', label: 'Mahad Yusuf' },
];

function filterState(): FilterState {
    const params = new URLSearchParams(window.location.search);

    return {
        url: '/components/filter-bar',
        filters: Object.fromEntries(params.entries()),
        searchPlaceholder: 'Search contacts',
        fields: [
            { key: 'status', label: 'Status', inline: true, placeholder: 'All statuses', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
            { key: 'owner', label: 'Owner', inline: true, placeholder: 'Anyone', options: owners, searchable: true },
            { key: 'source', label: 'Source', placeholder: 'Any source', options: [{ value: 'referral', label: 'Referral' }, { value: 'website', label: 'Website' }, { value: 'event', label: 'Event' }] },
            { key: 'period', label: 'Created', placeholder: 'Any time', options: [{ value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }] },
        ],
    };
}

function FilterBarBasic() {
    return <FilterBar state={filterState()} end={<Button variant="outline" size="sm">Export</Button>} />;
}

const activity: ActivityEntry[] = [
    { id: '1', kind: 'completed', actor: { name: 'Hodan Ali', initials: 'HA' }, action: 'completed the task', via: 'web', subject: { label: 'ZW-142', url: '#' }, at: '2026-11-07T09:12:00Z', at_label: '7 Nov 2026, 09:12', time_label: '09:12', day_label: 'Today', changes: [{ label: 'Stage', from: 'In review', to: 'Done' }], reason: null },
    { id: '2', kind: 'commented', actor: { name: 'Ayaan Warsame', initials: 'AW' }, action: 'commented', via: 'web', subject: { label: 'ZW-142', url: '#' }, at: '2026-11-07T08:40:00Z', at_label: '7 Nov 2026, 08:40', time_label: '08:40', day_label: 'Today', changes: [], reason: null },
    { id: '3', kind: 'deleted', actor: { name: 'Mahad Yusuf', initials: 'MY' }, action: 'moved the document to trash', via: 'web', subject: { label: 'Scope v2.pdf', url: '#' }, at: '2026-11-06T16:05:00Z', at_label: '6 Nov 2026, 16:05', time_label: '16:05', day_label: 'Yesterday', changes: [], reason: 'Superseded by Scope v3; the client signed the new version.' },
    { id: '4', kind: 'assigned', actor: null, action: 'assigned the task by automation', via: 'automation', subject: { label: 'ZW-139', url: '#' }, at: '2026-11-06T07:00:00Z', at_label: '6 Nov 2026, 07:00', time_label: '07:00', day_label: 'Yesterday', changes: [{ label: 'Assignee', from: null, to: 'Hodan Ali' }], reason: null },
];

function StatRow() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile raised label="Open deals" value="18" hint="4 closing this week" href="#" />
            <StatTile raised label="Pipeline" value="412,800" unit="USD" />
            <StatTile raised label="Won this month" value="6" />
            <StatTile raised label="Win rate" value="38" unit="%" hint="last 90 days" />
        </div>
    );
}

function DetailPair() {
    return (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <DetailCard
                title="Company"
                action={<Button variant="outline" size="sm">Update</Button>}
                details={[
                    { label: 'Legal name', value: 'Halcyon Freight Ltd' },
                    { label: 'Registration', value: <span className="font-mono text-xs">REG-2019-4471</span> },
                    { label: 'Industry', value: 'Logistics' },
                    { label: 'Website', value: 'halcyon.example' },
                    { label: 'Phone', value: null },
                ]}
            />
            <DetailCard
                compact
                title="Onboarding"
                details={[
                    { label: 'Reference', value: <span className="font-mono text-xs">ONB-0007</span> },
                    { label: 'Started by', value: 'Hodan Ali' },
                    { label: 'Approved by', value: 'Ayaan Warsame' },
                    { label: 'Approved', value: '3 Nov 2026' },
                    { label: 'Source', value: 'Referral' },
                ]}
            />
        </div>
    );
}

function FormCreate() {
    return (
        <FormLayout
            title="Create project"
            actions={
                <>
                    <FormCancel onCancel={() => toast('Cancelled')} />
                    <Button onClick={() => toast.success('Project created')}>Create project</Button>
                </>
            }
            side={
                <FormSection compact title="Client">
                    <FieldRow id="demo-company" label="Company">
                        <OptionSelect id="demo-company" placeholder="Pick a company" options={[{ value: '1', label: 'Halcyon Freight' }, { value: '2', label: 'Northwind Trading' }]} />
                    </FieldRow>
                </FormSection>
            }
        >
            <FormSection title="Project">
                <FieldRow id="demo-name" label="Name">
                    <Input id="demo-name" defaultValue="Warehouse rollout" />
                </FieldRow>
                <FieldRow id="demo-key" label="Key" hint="Two to four letters, used in task references" error="The key WH is already used by Warehouse audit.">
                    <Input id="demo-key" defaultValue="WH" aria-invalid />
                </FieldRow>
            </FormSection>
        </FormLayout>
    );
}

function FieldRowBasic() {
    return (
        <div className="grid max-w-md gap-4">
            <AlertError errors={['The tax number is already used by Kestrel Logistics.']} />
            <FieldRow id="demo-f-name" label="Name">
                <Input id="demo-f-name" defaultValue="Halcyon Freight" />
            </FieldRow>
            <FieldRow id="demo-f-tax" label="Tax number" hint="As printed on the certificate" error="The tax number is already used by Kestrel Logistics.">
                <Input id="demo-f-tax" defaultValue="TX-88120" aria-invalid />
            </FieldRow>
        </div>
    );
}

export const pageKitDemos2: Record<string, ComponentType> = {
    'filter-bar-basic': FilterBarBasic,
    'empty-state-first': () => (
        <EmptyState icon={FolderKanbanIcon} title="No projects yet" message="Projects group tasks, documents and time for one piece of work.">
            <Button>
                <PlusIcon /> Create project
            </Button>
        </EmptyState>
    ),
    'empty-state-permission': () => <EmptyState icon={LockIcon} title="No access to invoices" message="Ask a finance manager to grant Invoices · view." />,
    'tab-nav-record': () => (
        <TabNav
            label="Contact sections"
            tabs={[
                { label: 'Overview', href: '/components/tab-nav' },
                { label: 'Meetings', href: '/components/tab-nav?tab=meetings', count: 3 },
                { label: 'Activity', href: '/components/tab-nav?tab=activity' },
            ]}
        />
    ),
    'actions-menu-basic': () => (
        <div className="flex justify-end">
            <ActionsMenu
                items={[
                    { label: 'Export contact', onSelect: () => toast('Export started') },
                    { label: 'Merge into another', onSelect: () => toast('Merge dialog opens') },
                    { label: 'Deactivate contact', destructive: true, onSelect: () => toast('Reason dialog opens') },
                ]}
            />
        </div>
    ),
    'stat-tile-row': StatRow,
    'stat-tile-quiet': () => <div className="max-w-56"><StatTile label="Logged this week" value="31.5" unit="h" /></div>,
    'list-skeleton-basic': () => <ListSkeleton rows={4} />,
    'load-error-basic': () => <LoadError noun="invoices" onRetry={() => toast('Reloading invoices')} />,
    'activity-timeline-record': () => <ActivityTimeline entries={activity} />,
    'activity-timeline-audit': () => <ActivityTimeline entries={activity} showSubject />,
    'detail-card-pair': DetailPair,
    'form-layout-create': FormCreate,
    'field-row-basic': FieldRowBasic,
};
