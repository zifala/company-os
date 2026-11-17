# SecretReveal · Company OS

A secret shown once: read-only, select on focus, copy, and the line that says it will not come back.

**One job:** Hand over a signing secret or private link exactly once, from the flash, and never from props again.
**Category:** organization · **Pieces:** 22, 12 · **Exports:** SecretReveal, secretRevealLabels, SecretRevealLabels · **Tags:** secret, token, copy, once, webhook, calendar, api key

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/secret-reveal.json
```

Manual: copy components/company-os/secret-reveal.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, input.

## Overview

The Action returns the plain value, the controller flashes it, and the page renders this box while the flash is there. Reload and it is gone: only the hash, or the encrypted column, is kept.

Used by webhook endpoints (create and rotate) and the calendar feed link. Copy writes to the clipboard unless you pass `onCopy`.

## Examples

### After creating an endpoint

```tsx
import { SecretReveal } from '@/components/company-os';

{flash.webhookSecret && <SecretReveal label="Signing secret" value={flash.webhookSecret} />}
```

## Props

### SecretReveal

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | What the value is. |
| `value` | `string` | — | The plain secret, from the flash. |
| `hint` | `string` | — | Replaces the shown-once line. |
| `id` | `string` | `'secret-reveal'` | Input id; set it when two are on a page. |
| `onCopy` | `(value: string) => void` | — | Custom copy, e.g. with a toast. |
| `labels` | `Partial<SecretRevealLabels>` | — | Copy, copied, and the once line. |

## Accessibility

- The input is labelled and described by the once line.
- Focus selects the whole value for keyboard copy.

## Don't

- No secret in shared props, page props after the redirect, or logs.
- No "show again" button. Rotate or reset makes a new one.

## FAQ

**Why not a masked field with an eye?**

A mask implies the server still has the plain value to show. It does not.
