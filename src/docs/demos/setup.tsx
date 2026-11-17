import type { ComponentType } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FieldRow, FormSection, InsightItem, OnboardingCard, OnboardingStepper, ReviewProblems, SetupChecklist } from '@/components/company-os';
import type { Insight, OnboardingStepItem, ReviewSection, SetupStep } from '@/components/company-os';
import { Input } from '@/components/ui/input';

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

const onboardingSteps: OnboardingStepItem[] = [
    { key: 'company', label: 'Company', done: true },
    { key: 'finance', label: 'Finance', done: false },
    { key: 'documents', label: 'Documents', done: false },
    { key: 'review', label: 'Review', done: false },
];

const reviewSections: ReviewSection[] = [
    { key: 'company', label: 'Company', problems: [] },
    { key: 'finance', label: 'Finance', problems: ['Payment terms are required.'] },
    { key: 'documents', label: 'Documents', problems: ['Upload the registration certificate.'] },
];

function StepperDemo() {
    const [current, setCurrent] = useState('finance');
    const index = onboardingSteps.findIndex((step) => step.key === current);
    const go = (next: number) => setCurrent(onboardingSteps[Math.min(Math.max(next, 0), onboardingSteps.length - 1)].key);

    return (
        <div className="h-[560px] overflow-auto rounded-lg border border-border">
            <OnboardingStepper
                title="New provider onboarding"
                reference="ONB-0012"
                name="Daryeel Clinic"
                status={{ label: 'Sent back', color: 'amber' }}
                sentBack={{ reason: 'Add the payment terms we agreed.', by: 'Ayaan Warsame', at: '6 Nov 2026' }}
                steps={onboardingSteps}
                current={current}
                furthest={2}
                onSelect={setCurrent}
                exitHref="#"
                processing={false}
                onBack={() => go(index - 1)}
                onContinue={() => (current === 'review' ? toast.success('Submitted for review') : go(index + 1))}
            >
                {current === 'review' ? (
                    <ReviewProblems sections={reviewSections} onFix={setCurrent} />
                ) : (
                    <FormSection title={onboardingSteps[index].label} compact>
                        <FieldRow id={`demo-${current}`} label="Field">
                            <Input id={`demo-${current}`} />
                        </FieldRow>
                    </FormSection>
                )}
            </OnboardingStepper>
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
    'onboarding-stepper-basic': StepperDemo,
    'review-problems-basic': () => (
        <div className="max-w-2xl">
            <ReviewProblems sections={reviewSections} onFix={(key) => toast(`Opens the ${key} step`)} />
        </div>
    ),
    'insight-item-basic': InsightDemo,
};
