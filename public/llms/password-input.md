# PasswordInput · Company OS

A password input with a show / hide toggle that stays out of the tab order.

**One job:** Collect a password the user can check before submitting.
**Category:** forms · **Pieces:** 6 · **Exports:** PasswordInput · **Tags:** password, input, login, security

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/password-input.json
```

Manual: copy components/company-os/password-input.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: input.

## Overview

The shadcn Input with an eye toggle. Used on sign-in, the forced first password change, and the password confirmation before security settings. The toggle has `tabIndex={-1}` so Tab goes straight to the next field.

## Examples

### Change password

```tsx
import { PasswordInput, FieldRow } from '@/components/company-os';

<FieldRow id="password" label="New password" error={errors.password}>
  <PasswordInput id="password" name="password" autoComplete="new-password" />
</FieldRow>
```

## Props

### PasswordInput

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `…input props` | `ComponentProps<'input'>` | — | Everything but `type`. |
| `showLabel · hideLabel` | `string` | — | Accessible names of the toggle. |

## Accessibility

- The toggle is a button with a changing `aria-label`; it is skipped by Tab on purpose.

## Don't

- No strength meter. Laravel enforces the rules and returns the message.
- No autofill tricks.

## FAQ

**Generated password shown once?**

That is a read-only display with a copy button, not this input.
