# FieldRow · Company OS

Label, control, hint, error. Plus the form's error summary and its Cancel.

**One job:** Wrap one form control with its persistent label and its server error.
**Category:** page-kit · **Pieces:** 20 · **Exports:** FieldRow, InputError, AlertError, FormCancel · **Tags:** form, field, label, error, validation, cancel

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/field-row.json
```

Manual: copy components/company-os/field-row.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: label, alert, button.

## Overview

A field is a label, a control, an optional hint and the server error for that key. Labels persist; a placeholder is an example, never the label. The caller sets `aria-invalid` on the control when an error is present.

**AlertError** lists errors that have no field at the top of a form or the bottom of a dialog. **FormCancel** is the outline Cancel: a link to the index on a page, a callback in a dialog.

## Examples

### Fields with a hint and an error

```tsx
import { FieldRow, AlertError } from '@/components/company-os';

<AlertError errors={['The tax number is already used by Kestrel Logistics.']} />
<FieldRow id="name" label="Name" error={errors.name}>
  <Input id="name" name="name" defaultValue={company.name} aria-invalid={!!errors.name} />
</FieldRow>
<FieldRow id="tax" label="Tax number" hint="As printed on the certificate" error={errors.tax_number}>
  <Input id="tax" name="tax_number" aria-invalid={!!errors.tax_number} />
</FieldRow>
```

## Props

### FieldRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Matches the control's id for the label. |
| `label` | `string` | — | Persistent label. |
| `hint` | `string` | — | Shown under the control when there is no error. |
| `error` | `string` | — | The server message for this key. |

### AlertError · FormCancel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` | `string[]` | — | Deduplicated list. |
| `title` | `string` | `'The form was not saved.'` | Alert heading. |
| `href · onCancel · label` | `Href · () => void · string` | — | Link cancel on pages, callback cancel in dialogs. |

## Accessibility

- `<Label htmlFor>` binds the label; the error is plain text under the control.
- Set `aria-invalid` on the control so the ring and the screen reader agree.

## Don't

- No placeholder as a label.
- No client-side validation rules duplicated from Laravel.
- No error codes as messages. Say what failed and how to fix it.

## FAQ

**Required marker?**

Laravel sends `required_fields`; the page appends it to the label text it passes.
