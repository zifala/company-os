import type { DocEntry } from '../types';

export const passwordInput: DocEntry = {
    slug: 'password-input',
    name: 'PasswordInput',
    category: 'forms',
    pieces: [6],
    tagline: 'A password input with a show / hide toggle that stays out of the tab order.',
    job: 'Collect a password the user can check before submitting.',
    tags: ['password', 'input', 'login', 'security'],
    exports: ['PasswordInput'],
    files: ['components/company-os/password-input.tsx'],
    shadcnDeps: ['input'],
    intro: [
        'The shadcn Input with an eye toggle. Used on sign-in, the forced first password change, and the password confirmation before security settings. The toggle has <code>tabIndex={-1}</code> so Tab goes straight to the next field.',
    ],
    examples: [
        {
            title: 'Change password',
            demoKey: 'password-input-basic',
            code: `import { PasswordInput, FieldRow } from '@/components/company-os';

<FieldRow id="password" label="New password" error={errors.password}>
  <PasswordInput id="password" name="password" autoComplete="new-password" />
</FieldRow>`,
        },
    ],
    props: [
        {
            component: 'PasswordInput',
            rows: [
                { name: '…input props', type: "ComponentProps<'input'>", description: 'Everything but <code>type</code>.' },
                { name: 'showLabel · hideLabel', type: 'string', description: 'Accessible names of the toggle.' },
            ],
        },
    ],
    a11y: {
        notes: ['The toggle is a button with a changing <code>aria-label</code>; it is skipped by Tab on purpose.'],
    },
    donts: ['No strength meter. Laravel enforces the rules and returns the message.', 'No autofill tricks.'],
    faq: [{ q: 'Generated password shown once?', a: 'That is a read-only display with a copy button, not this input.' }],
};
