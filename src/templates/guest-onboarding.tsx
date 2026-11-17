import { useState } from 'react';
import { DetailCard, FieldRow, FormSection, OnboardingStepper, onboardingStepperLabels, PhoneField } from '@/components/company-os';
import type { OnboardingStepItem } from '@/components/company-os';
import { Input } from '@/components/ui/input';

const steps: OnboardingStepItem[] = [
    { key: 'you', label: 'About you', done: false },
    { key: 'address', label: 'Address', done: false },
    { key: 'documents', label: 'Documents', done: false },
    { key: 'review', label: 'Review', done: false },
];

const fixed = [
    { label: 'Invited by', value: 'Hodan Ali · Halcyon Freight' },
    { label: 'Source', value: 'Referral' },
    { label: 'Link expires', value: '14 Nov 2026' },
];

function StepBody({ step }: { step: string }) {
    if (step === 'address') {
        return (
            <FormSection title="Address">
                <FieldRow id="g-city" label="City">
                    <Input id="g-city" defaultValue="Mogadishu" />
                </FieldRow>
                <FieldRow id="g-district" label="District">
                    <Input id="g-district" />
                </FieldRow>
            </FormSection>
        );
    }
    if (step === 'documents') {
        return (
            <FormSection title="Documents" compact>
                <FieldRow id="g-id" label="ID card or passport" hint="A clear photo of both sides.">
                    <Input id="g-id" type="file" />
                </FieldRow>
            </FormSection>
        );
    }
    if (step === 'review') {
        return <p className="rounded-lg glass px-5 py-4 text-sm text-foreground">Check your answers, then submit. Halcyon Freight reviews it and calls you on the number you gave.</p>;
    }

    return (
        <>
            <FormSection title="You">
                <FieldRow id="g-name" label="Full name">
                    <Input id="g-name" defaultValue="Sahra Abdi" />
                </FieldRow>
                <PhoneField id="g-phone" label="Phone" defaultValue="+252617770431" />
            </FormSection>
            <DetailCard compact title="Set by your invitation" details={fixed} />
        </>
    );
}

export function GuestOnboarding() {
    const [current, setCurrent] = useState('you');
    const [furthest, setFurthest] = useState(0);
    const index = steps.findIndex((step) => step.key === current);

    const go = (next: number) => {
        const bounded = Math.min(Math.max(next, 0), steps.length - 1);
        setCurrent(steps[bounded].key);
        setFurthest((value) => Math.max(value, bounded));
    };

    return (
        <OnboardingStepper
            title="Halcyon Freight · Supplier details"
            reference="ONB-0013"
            name="Sahra Abdi"
            status={{ label: 'Draft', color: 'slate' }}
            steps={steps}
            current={current}
            furthest={furthest}
            onSelect={setCurrent}
            processing={false}
            labels={{ ...onboardingStepperLabels, submit: 'Send to Halcyon Freight' }}
            onBack={() => go(index - 1)}
            onContinue={() => go(index + 1)}
        >
            <StepBody step={current} />
        </OnboardingStepper>
    );
}
