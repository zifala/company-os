import type { DocEntry } from '../types';

export const fieldRow: DocEntry = {
    slug: 'field-row',
    name: 'FieldRow',
    category: 'page-kit',
    pieces: [20],
    tagline: 'Label, control, hint, error. Plus the form\'s error summary and its Cancel.',
    job: 'Wrap one form control with its persistent label and its server error.',
    tags: ['form', 'field', 'label', 'error', 'validation', 'cancel'],
    exports: ['FieldRow', 'InputError', 'AlertError', 'FormCancel'],
    files: ['components/company-os/field-row.tsx'],
    shadcnDeps: ['label', 'alert', 'button'],
    intro: [
        'A field is a label, a control, an optional hint and the server error for that key. Labels persist; a placeholder is an example, never the label. The caller sets <code>aria-invalid</code> on the control when an error is present.',
        '<b>AlertError</b> lists errors that have no field at the top of a form or the bottom of a dialog. <b>FormCancel</b> is the outline Cancel: a link to the index on a page, a callback in a dialog.',
    ],
    examples: [
        {
            title: 'Fields with a hint and an error',
            demoKey: 'field-row-basic',
            code: `import { FieldRow, AlertError } from '@/components/company-os';

<AlertError errors={['The tax number is already used by Kestrel Logistics.']} />
<FieldRow id="name" label="Name" error={errors.name}>
  <Input id="name" name="name" defaultValue={company.name} aria-invalid={!!errors.name} />
</FieldRow>
<FieldRow id="tax" label="Tax number" hint="As printed on the certificate" error={errors.tax_number}>
  <Input id="tax" name="tax_number" aria-invalid={!!errors.tax_number} />
</FieldRow>`,
        },
    ],
    props: [
        {
            component: 'FieldRow',
            rows: [
                { name: 'id', type: 'string', description: 'Matches the control\'s id for the label.' },
                { name: 'label', type: 'string', description: 'Persistent label.' },
                { name: 'hint', type: 'string', description: 'Shown under the control when there is no error.' },
                { name: 'error', type: 'string', description: 'The server message for this key.' },
            ],
        },
        {
            component: 'AlertError · FormCancel',
            rows: [
                { name: 'errors', type: 'string[]', description: 'Deduplicated list.' },
                { name: 'title', type: 'string', defaultValue: "'The form was not saved.'", description: 'Alert heading.' },
                { name: 'href · onCancel · label', type: 'Href · () => void · string', description: 'Link cancel on pages, callback cancel in dialogs.' },
            ],
        },
    ],
    a11y: {
        notes: [
            '<code>&lt;Label htmlFor&gt;</code> binds the label; the error is plain text under the control.',
            'Set <code>aria-invalid</code> on the control so the ring and the screen reader agree.',
        ],
    },
    donts: [
        'No placeholder as a label.',
        'No client-side validation rules duplicated from Laravel.',
        'No error codes as messages. Say what failed and how to fix it.',
    ],
    faq: [{ q: 'Required marker?', a: 'Laravel sends <code>required_fields</code>; the page appends it to the label text it passes.' }],
};
