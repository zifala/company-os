import { useState } from 'react';
import { ConfirmDialog, DetailCard, FormLayout, Pill, ReasonDialog, ReviewProblems, reviewProblemsLabels } from '@/components/company-os';
import type { ReviewSection } from '@/components/company-os';
import { Button } from '@/components/ui/button';

const progress: ReviewSection[] = [
    { key: 'company', label: 'Company', problems: [] },
    { key: 'contacts', label: 'Contacts', problems: [] },
    { key: 'finance', label: 'Finance', problems: [] },
    { key: 'documents', label: 'Documents', problems: [] },
];

type Pending = 'approve' | 'send-back' | 'reject' | null;

export function OnboardingReview() {
    const [pending, setPending] = useState<Pending>(null);
    // The reason dialog keeps its last kind so its copy does not flip while it animates closed.
    const [kind, setKind] = useState<'send-back' | 'reject'>('send-back');
    const [reason, setReason] = useState('');
    const open = (next: Exclude<Pending, null>) => {
        if (next !== 'approve') setKind(next);
        setReason('');
        setPending(next);
    };
    const close = () => setPending(null);
    const rejecting = kind === 'reject';

    return (
        <>
            <FormLayout
                title="Review ONB-0012"
                actions={
                    <>
                        <Pill name="Submitted" color="indigo" />
                        <Button variant="outline" onClick={() => open('reject')}>Reject</Button>
                        <Button variant="outline" onClick={() => open('send-back')}>Send back</Button>
                        <Button onClick={() => open('approve')}>Approve</Button>
                    </>
                }
                side={
                    <>
                        <ReviewProblems sections={progress} labels={{ ...reviewProblemsLabels, allReady: 'Every check passes. Approve creates the record.' }} />
                        <DetailCard compact title="Source" details={[{ label: 'Source', value: 'Referral' }, { label: 'Referred by', value: 'Halcyon Freight' }, { label: 'Started by', value: 'Hodan Ali' }, { label: 'Submitted', value: '7 Nov 2026, 08:15' }]} />
                    </>
                }
            >
                <DetailCard
                    title="Company"
                    details={[
                        { label: 'Legal name', value: 'Daryeel Clinic Ltd' },
                        { label: 'Registration', value: <span className="font-mono text-xs">REG-2021-0832</span> },
                        { label: 'Industry', value: 'Healthcare' },
                        { label: 'City', value: 'Mogadishu' },
                    ]}
                />
                <DetailCard title="Main contact" details={[{ label: 'Name', value: 'Idil Hassan' }, { label: 'Phone', value: '+252 61 555 0192' }, { label: 'Email', value: null }, { label: 'Role', value: 'Operations lead' }]} />
                <DetailCard title="Finance" details={[{ label: 'Payment terms', value: 'Net 30' }, { label: 'Currency', value: 'USD' }]} />
                <DetailCard title="Documents" details={[{ label: 'Registration certificate', value: 'registration-2026.pdf' }, { label: 'Tax clearance letter', value: 'tax-clearance.pdf' }]} />
            </FormLayout>
            <ConfirmDialog
                open={pending === 'approve'}
                onOpenChange={(next) => !next && close()}
                title="Approve ONB-0012"
                consequence="Daryeel Clinic becomes a provider, the main contact is created, and the documents move to the new record. This cannot be undone here."
                confirmLabel="Approve and create"
                cancelLabel="Not yet"
                destructive={false}
                onConfirm={close}
            />
            <ReasonDialog
                open={pending === 'send-back' || pending === 'reject'}
                onOpenChange={(next) => !next && close()}
                title={rejecting ? 'Reject ONB-0012' : 'Send ONB-0012 back'}
                consequence={rejecting ? 'The onboarding closes for good. Nothing is created. Hodan Ali sees your reason.' : 'Hodan Ali can edit it again and sees your reason on top of the stepper.'}
                confirmLabel={rejecting ? 'Reject onboarding' : 'Send back'}
                destructive={rejecting}
                reason={reason}
                onReasonChange={setReason}
                processing={false}
                onConfirm={close}
            />
        </>
    );
}
