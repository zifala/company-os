# ReasonDialog · Company OS

A confirm with a required reason, and a typed name for deletes. The reason lands in the audit log.

**One job:** Make every serious change say why before it happens.
**Category:** dialogs · **Pieces:** 6, 14, 16 · **Exports:** ReasonDialog, reasonLabels, ReasonLabels · **Tags:** dialog, reason, audit, delete, disable, reject, typed-name

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/reason-dialog.json
```

Manual: copy components/company-os/reason-dialog.tsx, components/company-os/confirm-dialog.tsx, hooks/use-controllable-open.ts into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: confirm-dialog.
shadcn primitives: button, dialog, input, label, textarea.

## Overview

Reject, send back, disable, revoke, delete, lose, cancel. Same shell as ConfirmDialog plus a **Reason** textarea and, when `confirmName` is set, a field where the user types the record's name. The verb button stays disabled until the reason has `minLength` characters and the name matches. Both are UX checks; `ReasonRequest` on the server is the real one.

The reason is the page's form state: `reason` and `onReasonChange` wire to `useForm({ reason: '' })`, `errors.reason` shows the 422, and the page resets the form only on success so a failed post keeps the typed text. The typed name is local and clears on close.

## Examples

### Deactivate with typed name

The demo rejects reasons under 10 characters the way a server would, and keeps the text.

```tsx
import { ReasonDialog } from '@/components/company-os';
import { useForm } from '@inertiajs/react';
import users from '@/routes/users';

const [open, setOpen] = useState(false);
const form = useForm({ reason: '' });

const deactivate = () =>
  form.post(users.deactivate(user.id).url, {
    preserveScroll: true,
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

<ReasonDialog
  trigger={<Button variant="destructive">{t('Deactivate user')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Deactivate :name', { name: user.name })}
  consequence={t(':name loses access right away. Open work needs a successor. The audit log keeps who did this and why.', { name: user.first_name })}
  confirmLabel={t('Deactivate user')}
  confirmName={user.name}
  reason={form.data.reason}
  onReasonChange={(reason) => form.setData('reason', reason)}
  errors={form.errors}
  processing={form.processing}
  onConfirm={deactivate}
/>
```

## Props

### ReasonDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `…ConfirmDialogProps` | `` | — | trigger, open, onOpenChange, title, consequence, confirmLabel, cancelLabel, destructive, processing, error, onConfirm. Same meaning. |
| `reason` | `string` | — | From `form.data.reason`. |
| `onReasonChange` | `(reason: string) => void` | — | `form.setData('reason', …)`. |
| `errors` | `{ reason?: string }` | — | Pass `form.errors`. Shown under the textarea. |
| `confirmName` | `string` | — | Set for deletes. Adds "Type … to confirm"; the button waits for a match. |
| `minLength` | `number` | `3` | Characters before the verb button enables. Match the request rule. |
| `labels` | `Partial<ReasonLabels>` | — | `reason` and `typeName(name)`. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Reason, typed name, Keep it, the verb button. |
| Esc | Close; the page keeps or resets the reason. |

- Both fields have visible `<label>`s; the server error sits directly under the textarea.
- The disabled verb button stays in the tab order so the reader learns it is not ready.
- The typed-name label contains the exact name to type.

## Don't

- No `useForm` inside the component. The page owns the form and the post.
- No reason in a query string or a toast. It goes in the request body and the activity row.
- No ReasonDialog from a table row. Serious changes start on the record's page.
- No skipped server rule. The 3-character minimum here is a courtesy.

## FAQ

**Why keep the text on error?**

A 422 means the user wrote something the server rejected. Resetting would make them write it twice. Reset in `onSuccess` only.

**Where does the reason end up?**

The Action validates it and stores `withProperties(['reason' => …])` on the activity row. History shows who, when and why.
