# VerifyPhoneDialog · Company OS

Fixed title, the phone, "Send code", then six digits and one confirm.

**One job:** Prove a phone number belongs to the person in front of the screen.
**Category:** forms · **Pieces:** 6, 27 · **Exports:** VerifyPhoneDialog, VerifyPhoneLabels · **Tags:** phone, otp, verify, dialog, code

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/verify-phone-dialog.json
```

Manual: copy components/company-os/verify-phone-dialog.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: phone-field, field-row.
shadcn primitives: dialog, input-otp, button, label, spinner.

## Overview

One fixed title and a one-line description. The phone sits in the shared PhoneInput with "Send code" beside it; after a send, a six-digit code field appears and the confirm button unlocks at six digits. The page owns both requests and passes `sending`, `sentTo`, `processing` and the errors.

## Examples

### Confirm a customer phone

```tsx
import { VerifyPhoneDialog } from '@/components/company-os';

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
/>
```

## Props

### VerifyPhoneDialog

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `phone · onPhoneChange` | `string · (phone) => void` | — | Without `onPhoneChange` the number is read-only. |
| `onSend · sending · sentTo` | `() => void · boolean · string | null` | — | The send request and its state; `sentTo` non-null shows the code field. |
| `onConfirm · processing` | `(code) => void · boolean` | — | The confirm request. |
| `codeError · phoneError` | `string` | — | Server messages. |
| `labels` | `VerifyPhoneLabels` | — | phone, code, send, sendAgain, cancel. |

## Accessibility

- The code field is the input-otp primitive: one logical input, six visible slots, digits only, autofocus after send.

## Don't

- No data in the title. "Confirm phone", never the number.
- No resend countdown in React; the server throttles and returns the message.

## FAQ

**Where is the number edited?**

Pass `onPhoneChange` to allow it before the first send; after a send it locks until the dialog closes.
