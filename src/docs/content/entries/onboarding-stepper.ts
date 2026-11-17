import type { DocEntry } from '../types';

export const onboardingStepper: DocEntry = {
    slug: 'onboarding-stepper',
    name: 'OnboardingStepper',
    category: 'setup',
    pieces: [27],
    tagline: 'Full screen, a thin header with Exit, the left rail of steps, Back and "Confirm and continue".',
    job: 'Walk staff or a guest through an onboarding one saved slice at a time.',
    tags: ['onboarding', 'stepper', 'wizard', 'steps', 'guest', 'send back'],
    exports: ['OnboardingStepper', 'onboardingStepperLabels', 'OnboardingStepperLabels', 'SentBack', 'OnboardingRail', 'OnboardingStepItem', 'stepLocked'],
    files: ['components/company-os/onboarding-stepper.tsx', 'components/company-os/onboarding-rail.tsx'],
    registryDeps: ['pill'],
    shadcnDeps: ['alert', 'button'],
    intro: [
        'No app shell. The rail shows the reference, the name, the status pill and the steps. A step beyond the furthest reached stays locked unless it is done. The main column carries the step title, the step body as children, and a sticky footer.',
        'When the onboarding came back, <code>sentBack</code> renders the reviewer\'s reason on top; the page reads it from the latest <code>sent_back</code> activity entry. On the last step the continue button reads "Submit for review". For a guest link pass no <code>exitHref</code> and override the submit label.',
    ],
    examples: [
        {
            title: 'Sent back, on the finance step',
            demoKey: 'onboarding-stepper-basic',
            code: `import { OnboardingStepper } from '@/components/company-os';

<OnboardingStepper
  title={t('New provider onboarding')}
  reference={onboarding.reference}
  name={onboarding.name}
  status={onboarding.status}
  sentBack={onboarding.sent_back}
  steps={progress}
  current={step}
  furthest={furthest}
  onSelect={setStep}
  exitHref={onboardings.index().url}
  processing={form.processing}
  onBack={back}
  onContinue={() => form.post(onboardingUrls(onboarding.id).saveStep(step), { onSuccess: next })}
>
  <StepFields step={step} form={form} />
</OnboardingStepper>`,
        },
    ],
    props: [
        {
            component: 'OnboardingStepper',
            rows: [
                { name: 'title · reference · name · status', type: 'string · string · string · Status', description: 'Header title and the rail\'s summary.' },
                { name: 'steps', type: 'OnboardingStepItem[]', description: '<code>{ key, label, done }</code> from <code>OnboardingChecks::progress()</code>, plus documents and review.' },
                { name: 'current · furthest · onSelect', type: 'string · number · (key) => void', description: 'Current step key, index of the furthest step reached, rail click.' },
                { name: 'sentBack', type: 'SentBack | null', description: '<code>{ reason, by, at }</code>.' },
                { name: 'exitHref', type: 'Href | null', defaultValue: 'null', description: 'Shows Exit. Null on the guest page.' },
                { name: 'onBack · onContinue · processing', type: '() => void · () => void · boolean', description: 'Footer actions.' },
                { name: 'editable', type: 'boolean', defaultValue: 'true', description: 'False once submitted: no continue button.' },
                { name: 'labels', type: 'OnboardingStepperLabels', description: 'exit, back, next, submit, sentBack(by, at), stepOf(index, total).' },
            ],
        },
    ],
    a11y: { notes: ['The rail is an ordered list; the current step has <code>aria-current="step"</code>.', 'Locked steps are disabled buttons with the reason as their title.'] },
    donts: ['No app shell around the stepper.', 'No saving the whole form on every step. Each step posts its own fields.', 'No "Create <party>" route beside it. The record is born on approve.'],
    faq: [{ q: 'Guest and staff, one component?', a: 'Yes. The guest page passes the guest steps, no exit, and a submit label naming the reviewer. Link fields show as a read-only card.' }],
};
