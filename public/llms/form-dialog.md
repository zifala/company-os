# FormDialog · Company OS

A dialog that is a form: title, your fields, Cancel and a submit that names the object.

**One job:** Create or rename a small record without leaving the page.
**Category:** dialogs · **Pieces:** 25 · **Exports:** FormDialog · **Tags:** dialog, form, create, rename, setup-lists, inline

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/form-dialog.json
```

Manual: copy components/company-os/form-dialog.tsx, hooks/use-controllable-open.ts into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, dialog.

## Overview

The shell around a `<form>`. The page renders **FieldRow**s as children bound to its `useForm`, passes `processing` and an `onSubmit` that posts. Enter submits, the footer has Cancel and the submit button. Setup lists (lead sources, stages, labels), rename, quick create from the New menu: anything with up to five fields.

Same control pattern as the other dialogs: a `trigger`, or `open` + `onOpenChange` from a menu or the New menu. Reset the form on success, keep it on a 422 so errors sit next to their fields.

## Examples

### Add a lead source

One FieldRow. The demo rejects an empty name after 600 ms.

```tsx
import { FieldRow, FormDialog } from '@/components/company-os';
import { useForm } from '@inertiajs/react';
import lists from '@/routes/setup/lists';

const [open, setOpen] = useState(false);
const form = useForm({ name: '' });

const save = () =>
  form.post(lists.store('lead-sources').url, {
    preserveScroll: true,
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

<FormDialog
  trigger={<Button><PlusIcon /> {t('Add lead source')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Add lead source')}
  description={t('Lead sources appear on every deal and in the pipeline report.')}
  submitLabel={t('Add lead source')}
  processing={form.processing}
  onSubmit={save}
>
  <FieldRow id="lead-source-name" label={t('Name')} error={form.errors.name}>
    <Input id="lead-source-name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} />
  </FieldRow>
</FormDialog>
```

## Props

### FormDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Optional opener. |
| `open · onOpenChange` | `boolean · (open) => void` | — | Controlled state. |
| `title` | `string` | — | Verb + object: "Add lead source", "Rename stage". |
| `description` | `string` | — | One sentence of context when the title is not enough. |
| `submitLabel` | `string` | — | Same verb + object as the title. Never "Submit" or "Save". |
| `cancelLabel` | `string` | `'Cancel'` | Closes without posting. |
| `processing` | `boolean` | `false` | Disables the submit button. |
| `onSubmit` | `() => void` | — | Called on Enter or the submit button. The page posts. |
| `children` | `ReactNode` | — | FieldRows bound to the page form. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter | Submit from any field. |
| Tab | Fields, Cancel, submit. |
| Esc | Close without posting. |

- A real `<form>` inside the dialog, so Enter and implicit submission work.
- Cancel is `type="button"`; only the submit button submits.
- Errors render under their fields through FieldRow, not in a summary.

## Don't

- No `useForm` inside. The page owns the form.
- No status field in the form. Status changes go through ConfirmDialog or ReasonDialog.
- No dialog for a form with more than five fields. That is a page.
- No "Save" or "Submit" label.

## FAQ

**Edit and create in one dialog?**

Yes. Pass the record values as the form defaults and switch `title` and `submitLabel`; the post goes to store or update.

**Opened from the New menu?**

The menu item sets a `dialog` state; the FormDialog renders beside the menu with `open={dialog === 'contact'}`.
