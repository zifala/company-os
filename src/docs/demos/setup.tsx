import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { InsightItem, OnboardingCard, SetupChecklist } from '@/components/company-os';
import type { Insight, SetupStep } from '@/components/company-os';

const steps: SetupStep[] = [
    { key: 'organisation', title: 'Name your organisation and set its timezone', done: true, links: [{ label: 'Workspace', href: '#' }] },
    { key: 'team', title: 'Invite a second person', done: false, links: [{ label: 'Users', href: '#' }] },
    { key: 'security', title: 'Require two-factor for privileged roles', done: false, links: [{ label: 'Workspace', href: '#' }] },
    { key: 'lists', title: 'Review the lead sources and stages', done: null, links: [{ label: 'Lead sources', href: '#' }, { label: 'Stages', href: '#' }] },
    { key: 'services', title: 'Mail and queue are configured', done: true, links: [] },
];

function SetupDemo() {
    const [finishing, setFinishing] = useState(false);

    return (
        <SetupChecklist
            steps={steps}
            finishing={finishing}
            onFinish={() => {
                setFinishing(true);
                window.setTimeout(() => {
                    setFinishing(false);
                    toast.success('Setup finished');
                }, 600);
            }}
        />
    );
}

const insight: Insight = {
    id: 'i1',
    title: 'Three invoices are overdue by more than 30 days',
    body: 'INV-0409, INV-0401 and INV-0398 add up to 21,420 USD past due. Kestrel Logistics holds two of them.',
    agent: 'Finance watch',
    kind: 'overdue_invoices',
    written: true,
    severity: { label: 'Warning', color: 'amber' },
    status: { value: 'open', label: 'Open', live: true },
    updated_label: '2 h ago',
    date_label: '7 Nov 2026, 07:00',
    evidence: [
        { text: 'INV-0409 · 9,850 USD · due 30 Oct 2026', links: [{ label: 'INV-0409', href: '#' }, { label: 'Kestrel Logistics', href: '#' }] },
        { text: 'INV-0401 · 6,200 USD · due 12 Oct 2026', links: [{ label: 'INV-0401', href: '#' }] },
        { text: 'INV-0398 · 5,370 USD · due 2 Oct 2026', links: [{ label: 'INV-0398', href: '#' }, { label: 'Kestrel Logistics', href: '#' }] },
    ],
    suggestions: [
        { index: 0, type: 'Remind', label: 'Send a payment reminder for the three invoices', reason: 'No reminder went out in the last 14 days.', applied: false },
        { index: 1, type: 'Create task', label: 'Create a follow-up task for Ayaan Warsame', reason: 'Ayaan owns both Kestrel invoices.', applied: true },
    ],
};

function InsightDemo() {
    const [pending, setPending] = useState<number | null>(null);

    return (
        <div className="max-w-2xl rounded-lg glass p-5">
            <InsightItem
                insight={insight}
                evidenceOpen
                pending={pending}
                onApply={(index) => {
                    setPending(index);
                    window.setTimeout(() => {
                        setPending(null);
                        toast.success('Reminder sent for 3 invoices');
                    }, 700);
                }}
                onAcknowledge={() => toast('Marked seen')}
                onDismiss={() => toast('Reason dialog opens')}
            />
        </div>
    );
}

export const setupDemos: Record<string, ComponentType> = {
    'setup-checklist-basic': SetupDemo,
    'onboarding-card-basic': () => (
        <div className="max-w-sm">
            <OnboardingCard
                onboarding={{ reference: 'ONB-0007', href: '#', started_by: 'Hodan Ali', approved_by: 'Ayaan Warsame', approved_at: '3 Nov 2026', source: 'Referral', referrer: 'Halcyon Freight' }}
            />
        </div>
    ),
    'insight-item-basic': InsightDemo,
};
