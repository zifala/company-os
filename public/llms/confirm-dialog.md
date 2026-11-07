# ConfirmDialog · Company OS

Title, one sentence of consequence, Keep it, and a button that names the verb. For the light status changes.

**One job:** Stop a one-click state change long enough to read what it does.
**Category:** dialogs · **Pieces:** 14, 16 · **Exports:** ConfirmDialog, ConfirmDialogProps · **Tags:** dialog, confirm, status, archive, restore, destructive

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/confirm-dialog.json
```

Manual: copy components/company-os/confirm-dialog.tsx, hooks/use-controllable-open.ts into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, dialog.

## Overview

Archive, restore, pause, resume, complete: verbs with no reason go through this. The page owns the request: `onConfirm` fires the Inertia visit, `processing` disables the button, `error` shows the server's first message under the text, and the page closes the dialog on success. Nothing posts from inside.

Works with a `trigger` or fully controlled from a menu item (`open` + `onOpenChange`, dialog rendered outside the menu). The confirm button is destructive by default; pass `destructive={false}` for archive-like verbs.

## Examples

### Archive

The demo waits 800 ms, then closes and toasts.

```tsx
import { ConfirmDialog } from '@/components/company-os';
import { router } from '@inertiajs/react';
import companies from '@/routes/companies';

const [open, setOpen] = useState(false);
const [processing, setProcessing] = useState(false);
const [error, setError] = useState<string>();

const archive = () =>
  router.post(companies.archive(company.id).url, {}, {
    preserveScroll: true,
    onStart: () => setProcessing(true),
    onFinish: () => setProcessing(false),
    onSuccess: () => setOpen(false),
    onError: (errors) => setError(Object.values(errors)[0]),
  });

<ConfirmDialog
  trigger={<Button variant="outline">{t('Archive company')}</Button>}
  open={open}
  onOpenChange={setOpen}
  title={t('Archive :name', { name: company.name })}
  consequence={t('The company leaves every list. Its invoices and history stay. Restore from Trash within 30 days.')}
  confirmLabel={t('Archive company')}
  destructive={false}
  processing={processing}
  error={error}
  onConfirm={archive}
/>
```

## Props

### ConfirmDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Optional opener. Omit when a menu item controls `open`. |
| `open · onOpenChange` | `boolean · (open) => void` | — | Controlled state. Uncontrolled when both are omitted. |
| `title` | `string` | — | Verb + object name: "Archive Halcyon Freight". |
| `consequence` | `string` | — | One sentence: what happens, what stays. |
| `confirmLabel` | `string` | — | Verb + object: "Archive company". Never "Confirm" or "Yes". |
| `cancelLabel` | `string` | `'Keep it'` | The safe exit. |
| `destructive` | `boolean` | `true` | Rose button. False for archive, pause, complete. |
| `processing` | `boolean` | `false` | Disables the confirm button while the request runs. |
| `error` | `string` | — | Server message shown under the consequence. |
| `onConfirm` | `() => void` | — | The page sends the request. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Keep it, then the verb button. |
| Esc | Close without acting. |

- Radix Dialog: focus trapped, title and description wired to the dialog, focus returns to the trigger.
- The error line is plain text next to the description, read in order.

## Don't

- No request inside the dialog. The page posts and closes.
- No generic `PATCH { status }`. One route and one Action per verb.
- No "Confirm", "OK", "Yes". The button says the verb and the object.
- No dialog inside `DropdownMenuContent`. Lift it out and control `open`.
- No reason-less dialog for reject, disable, revoke or delete. Those use ReasonDialog.

## FAQ

**Which verbs?**

Archive, restore, pause, resume, complete, a boolean toggle in a setup table. Anything someone may later ask "why" about goes through ReasonDialog.

**Where does the trigger show?**

Only when the response carries `can.<verb>` true. The policy decides; React hides.
