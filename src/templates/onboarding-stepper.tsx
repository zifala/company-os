import { useState } from 'react';
import { FieldRow, FormSection, OnboardingStepper, PhoneField, ReviewProblems } from '@/components/company-os';
import type { OnboardingStepItem, ReviewSection } from '@/components/company-os';
import { Input } from '@/components/ui/input';
import { OptionSelect } from '@/components/ui/option-select';

const initialSteps: OnboardingStepItem[] = [
    { key: 'company', label: 'Company', done: true },
    { key: 'contacts', label: 'Contacts', done: true },
    { key: 'finance', label: 'Finance', done: false },
    { key: 'documents', label: 'Documents', done: false },
    { key: 'review', label: 'Review', done: false },
];

const problems: ReviewSection[] = [
    { key: 'company', label: 'Company', problems: [] },
    { key: 'contacts', label: 'Contacts', problems: [] },
    { key: 'finance', label: 'Finance', problems: ['Payment terms are required.'] },
    { key: 'documents', label: 'Documents', problems: ['Upload the registration certificate.', 'Upload a tax clearance letter.'] },
];

function StepBody({ step, onFix }: { step: string; onFix: (key: string) => void }) {
    if (step === 'review') return <ReviewProblems sections={problems} onFix={onFix} />;
    if (step === 'contacts') {
        return (
            <FormSection title="Main contact">
                <FieldRow id="ob-contact" label="Name">
                    <Input id="ob-contact" defaultValue="Idil Hassan" />
                </FieldRow>
                <PhoneField id="ob-contact-phone" label="Phone" defaultValue="+252615550192" />
            </FormSection>
        );
    }
    if (step === 'finance') {
        return (
            <FormSection title="Finance">
                <FieldRow id="ob-terms" label="Payment terms" error="Payment terms are required.">
                    <OptionSelect id="ob-terms" placeholder="Pick terms" aria-invalid options={[{ value: 'net15', label: 'Net 15' }, { value: 'net30', label: 'Net 30' }, { value: 'prepaid', label: 'Prepaid' }]} />
                </FieldRow>
                <FieldRow id="ob-currency" label="Currency">
                    <OptionSelect id="ob-currency" defaultValue="usd" options={[{ value: 'usd', label: 'USD' }, { value: 'sos', label: 'SOS' }]} />
                </FieldRow>
            </FormSection>
        );
    }
    if (step === 'documents') {
        return (
            <FormSection title="Documents" compact>
                <FieldRow id="ob-registration" label="Registration certificate" hint="PDF or image, up to 10 MB.">
                    <Input id="ob-registration" type="file" />
                </FieldRow>
                <FieldRow id="ob-tax" label="Tax clearance letter">
                    <Input id="ob-tax" type="file" />
                </FieldRow>
            </FormSection>
        );
    }

    return (
        <FormSection title="Company">
            <FieldRow id="ob-name" label="Legal name">
                <Input id="ob-name" defaultValue="Daryeel Clinic Ltd" />
            </FieldRow>
            <FieldRow id="ob-reg" label="Registration">
                <Input id="ob-reg" defaultValue="REG-2021-0832" />
            </FieldRow>
        </FormSection>
    );
}

export function OnboardingStepperPage() {
    const [steps, setSteps] = useState(initialSteps);
    const [current, setCurrent] = useState('finance');
    const index = steps.findIndex((step) => step.key === current);
    const [furthest, setFurthest] = useState(index);
    const [processing, setProcessing] = useState(false);

    const go = (next: number) => {
        const bounded = Math.min(Math.max(next, 0), steps.length - 1);
        setCurrent(steps[bounded].key);
        setFurthest((value) => Math.max(value, bounded));
    };

    return (
        <OnboardingStepper
            title="New provider onboarding"
            reference="ONB-0012"
            name="Daryeel Clinic"
            status={{ label: 'Sent back', color: 'amber' }}
            sentBack={{ reason: 'The registration certificate is from 2019. Upload the renewed one and add the payment terms we agreed.', by: 'Ayaan Warsame', at: '6 Nov 2026' }}
            steps={steps}
            current={current}
            furthest={furthest}
            onSelect={setCurrent}
            exitHref="/templates"
            processing={processing}
            onBack={() => go(index - 1)}
            onContinue={() => {
                setProcessing(true);
                window.setTimeout(() => {
                    setSteps((list) => list.map((step) => (step.key === current && step.key !== 'review' ? { ...step, done: true } : step)));
                    setProcessing(false);
                    go(index + 1);
                }, 500);
            }}
        >
            <StepBody step={current} onFix={setCurrent} />
        </OnboardingStepper>
    );
}
