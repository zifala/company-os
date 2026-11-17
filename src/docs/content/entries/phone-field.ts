import type { DocEntry } from '../types';

export const phoneField: DocEntry = {
    slug: 'phone-field',
    name: 'PhoneField',
    category: 'forms',
    pieces: [6, 27],
    tagline: 'The one phone input: country selector, as-you-type formatting, E.164 out, Somalia first.',
    job: 'Collect one valid phone number in international form.',
    tags: ['phone', 'input', 'country', 'libphonenumber', 'E.164', 'form'],
    exports: ['PhoneField', 'PhoneInput', 'isValidPhone', 'DEFAULT_COUNTRY'],
    files: ['components/company-os/phone-field.tsx', 'components/company-os/phone-input.tsx'],
    registryDeps: ['field-row'],
    shadcnDeps: ['command', 'popover'],
    intro: [
        'A searchable country selector and a national-format input in one field. The value that leaves the component is always E.164 (<code>+252612345678</code>); pasting an international number switches the country. Default country is Somalia (+252), set once per project.',
        '<b>PhoneField</b> wraps it in a FieldRow with a label, the server error, and a client check on blur that says the number is not valid for the chosen country. Laravel validates again. There is no other phone input anywhere in a product, dialogs included.',
    ],
    examples: [
        {
            title: 'In a form',
            demoKey: 'phone-field-basic',
            code: `import { PhoneField } from '@/components/company-os';

<PhoneField id="phone" name="phone" label="Phone" defaultValue={contact.phone} error={errors.phone} />`,
        },
    ],
    props: [
        {
            component: 'PhoneField',
            rows: [
                { name: 'id · label', type: 'string', description: 'Field id and persistent label.' },
                { name: 'name', type: 'string', description: 'Adds a hidden input with the E.164 value for <code>&lt;Form&gt;</code> pages.' },
                { name: 'value · defaultValue · onChange', type: 'string · string · (value) => void', description: 'Controlled or uncontrolled.' },
                { name: 'error · hint', type: 'string', description: 'Server error wins over the client message.' },
                { name: 'invalidMessage', type: 'string', defaultValue: "'Enter a valid phone number for the chosen country.'", description: 'The client message on blur.' },
                { name: 'disabled', type: 'boolean', description: 'Disables the country button and the input.' },
                { name: 'labels', type: 'PhoneLabels', description: 'Passed to PhoneInput.' },
            ],
        },
        {
            component: 'PhoneInput',
            rows: [
                { name: 'id', type: 'string', description: 'On the number input, for the label.' },
                { name: 'value · onChange', type: 'string | null · (value: string) => void', description: 'Controlled, E.164 in and out. A value the parent sets (reset, server data) replaces what is shown.' },
                { name: 'disabled · invalid', type: 'boolean', description: 'Disabled state and <code>aria-invalid</code> with the destructive border.' },
                { name: 'onBlur', type: '() => void', description: 'From the number input; PhoneField uses it for the client check.' },
                { name: 'defaultCountry', type: 'CountryCode', defaultValue: "'SO'", description: 'Used when the value has no country.' },
                { name: 'locale', type: 'string', defaultValue: "'en'", description: 'Country names via <code>Intl.DisplayNames</code>.' },
                { name: 'labels', type: 'PhoneLabels', description: '<code>country</code>, <code>searchCountry</code>, <code>noMatch</code>.', defaultValue: "{ country: 'Country code', searchCountry: 'Search country', noMatch: 'Nothing matches.' }" },
            ],
        },
    ],
    a11y: {
        keyboard: [{ keys: 'Tab', action: 'Country button, then the number input.' }],
        notes: [
            'The country button carries the <code>labels.country</code> name; the input is <code>type="tel"</code> with <code>autoComplete="tel-national"</code>.',
            '<code>aria-invalid</code> follows the error state.',
        ],
    },
    donts: [
        'No plain text input for a phone anywhere.',
        'No local-format storage. Store E.164.',
        'No client-only validation. Laravel checks the number with the same library.',
    ],
    faq: [
        { q: 'Verify a phone by code?', a: 'VerifyPhoneDialog: this input disabled, "Send code" beside it, then a six-digit code field.' },
    ],
};
