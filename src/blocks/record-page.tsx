import { useState } from 'react';
import { ActionsMenu, ActivityTimeline, DetailCard, FavoriteButton, OnboardingCard, PageHeader, Pill, TabNav } from '@/components/company-os';
import type { ActivityEntry } from '@/components/company-os';
import { Button } from '@/components/ui/button';

const activity: ActivityEntry[] = [
    { id: '1', kind: 'updated', actor: { name: 'Hodan Ali', initials: 'HA' }, action: 'changed the owner', via: 'web', at: '2026-11-06T10:20:00Z', at_label: '6 Nov 2026, 10:20', time_label: '10:20', day_label: 'Yesterday', changes: [{ label: 'Owner', from: 'Mahad Yusuf', to: 'Hodan Ali' }], reason: null },
    { id: '2', kind: 'created', actor: { name: 'Ayaan Warsame', initials: 'AW' }, action: 'approved the onboarding', via: 'web', at: '2026-11-03T14:02:00Z', at_label: '3 Nov 2026, 14:02', time_label: '14:02', day_label: '3 Nov 2026', changes: [], reason: null },
];

export function RecordPage() {
    const [saved, setSaved] = useState(true);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Halcyon Freight" meta={<Pill name="Active" color="emerald" />}>
                <FavoriteButton saved={saved} label="Halcyon Freight" onToggle={() => setSaved((value) => !value)} />
                <Button variant="outline">Log interaction</Button>
                <ActionsMenu
                    items={[
                        { label: 'Export company', onSelect: () => undefined },
                        { label: 'Merge into another', onSelect: () => undefined },
                        { label: 'Deactivate company', destructive: true, onSelect: () => undefined },
                    ]}
                />
            </PageHeader>
            <TabNav
                label="Company sections"
                tabs={[
                    { label: 'Overview', href: '/blocks' },
                    { label: 'Contacts', href: '/blocks?tab=contacts', count: 4 },
                    { label: 'Deals', href: '/blocks?tab=deals', count: 2 },
                    { label: 'Activity', href: '/blocks?tab=activity' },
                ]}
            />
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-6">
                    <DetailCard
                        title="Company"
                        action={<Button variant="outline" size="sm">Update</Button>}
                        details={[
                            { label: 'Legal name', value: 'Halcyon Freight Ltd' },
                            { label: 'Registration', value: <span className="font-mono text-xs">REG-2019-4471</span> },
                            { label: 'Industry', value: 'Logistics' },
                            { label: 'Website', value: 'halcyon.example' },
                            { label: 'Owner', value: 'Hodan Ali' },
                            { label: 'Phone', value: '+252 61 234 5678' },
                        ]}
                    />
                    <section className="rounded-lg glass p-5">
                        <h2 className="mb-4 text-sm font-semibold text-slate-800">Activity</h2>
                        <ActivityTimeline entries={activity} />
                    </section>
                </div>
                <div className="grid gap-6">
                    <DetailCard compact title="Finance" details={[{ label: 'Payment terms', value: 'Net 30' }, { label: 'Currency', value: 'USD' }, { label: 'Open balance', value: <span className="font-bold tabular-nums">USD 12,960.00</span> }]} />
                    <OnboardingCard onboarding={{ reference: 'ONB-0007', href: '#', started_by: 'Hodan Ali', approved_by: 'Ayaan Warsame', approved_at: '3 Nov 2026', source: 'Referral', referrer: null }} />
                </div>
            </div>
        </div>
    );
}
