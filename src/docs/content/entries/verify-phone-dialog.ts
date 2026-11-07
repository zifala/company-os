import type { DocEntry } from '../types';

export const verifyPhoneDialog: DocEntry = {
    slug: 'verify-phone-dialog',
    name: 'VerifyPhoneDialog',
    category: 'forms',
    pieces: [6, 27],
    tagline: 'Fixed title, the phone, "Send code", then six digits and one confirm.',
    job: 'Prove a phone number belongs to the person in front of the screen.',
    tags: ['phone', 'otp', 'verify', 'dialog', 'code'],
    exports: ['VerifyPhoneDialog', 'VerifyPhoneLabels'],
    files: ['components/company-os/verify-phone-dialog.tsx'],
    registryDeps: ['phone-field', 'field-row'],
    shadcnDeps: ['dialog', 'input-otp', 'button', 'label', 'spinner'],
    intro: [
        'One fixed title and a one-line description. The phone sits in the shared PhoneInput with "Send code" beside it; after a send, a six-digit code field appears and the confirm button unlocks at six digits. The page owns both requests and passes <code>sending</code>, <code>sentTo</code>, <code>processing</code> and the errors.',
    ],
    examples: [
        {
            title: 'Confirm a customer phone',
            demoKey: 'verify-phone-dialog-basic',
            code: `import { VerifyPhoneDialog } from '@/components/company-os';

<VerifyPhoneDialog
  open={verifying}
  onOpenChange={setVerifying}
  title="Confirm phone"
  description="We send a six-digit code by SMS."
  phone={form.data.phone}
  onSend={() => void send.submit(phones.send())}
  sending={send.processing}
  sentTo={sentTo}
  onConfirm={(code) => form.transform((d) => ({ ...d, code })).post(phones.confirm().url)}
  confirmLabel="Confirm phone"
  processing={form.processing}
  codeError={form.errors.code}
/>`,
        },
    ],
    props: [
        {
            component: 'VerifyPhoneDialog',
            rows: [
                { name: 'phone · onPhoneChange', type: 'string · (phone) => void', description: 'Without <code>onPhoneChange</code> the number is read-only.' },
                { name: 'onSend · sending · sentTo', type: '() => void · boolean · string | null', description: 'The send request and its state; <code>sentTo</code> non-null shows the code field.' },
                { name: 'onConfirm · processing', type: '(code) => void · boolean', description: 'The confirm request.' },
                { name: 'codeError · phoneError', type: 'string', description: 'Server messages.' },
                { name: 'labels', type: 'VerifyPhoneLabels', description: 'phone, code, send, sendAgain, cancel.' },
            ],
        },
    ],
    a11y: {
        notes: ['The code field is the input-otp primitive: one logical input, six visible slots, digits only, autofocus after send.'],
    },
    donts: ['No data in the title. "Confirm phone", never the number.', 'No resend countdown in React; the server throttles and returns the message.'],
    faq: [{ q: 'Where is the number edited?', a: 'Pass <code>onPhoneChange</code> to allow it before the first send; after a send it locks until the dialog closes.' }],
};
