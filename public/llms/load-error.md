# LoadError · Company OS

The fourth state of a data region: it did not load, and here is the button that tries again.

**One job:** Say a region failed to load and offer one retry.
**Category:** page-kit · **Pieces:** 20 · **Exports:** LoadError · **Tags:** error, retry, deferred, rescue, state

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/load-error.json
```

Manual: copy components/company-os/load-error.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button.

## Overview

A rose-tinted line naming the noun that failed and a button that reloads only that prop. It is the `rescue` of every `<Deferred>`; without it a failed deferred request leaves the skeleton forever.

Every data region shows four states: loading, empty, error, loaded. This is the error.

## Examples

### Rescue of a deferred prop

```tsx
import { LoadError } from '@/components/company-os';

<Deferred data="invoices" fallback={<DataTableSkeleton />} rescue={<LoadError prop="invoices" noun="invoices" />}>
  …
</Deferred>
```

## Props

### LoadError

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `noun` | `string` | — | What failed, plural: "invoices". |
| `prop` | `string` | — | The page prop to reload. Default retry calls `reload({ only: [prop] })`. |
| `onRetry` | `() => void` | — | Replaces the default retry. |
| `message · label` | `string` | — | Translated copy. Defaults: "The {noun} did not load." and "Load {noun} again". |

## Accessibility

- Plain text plus one button; the button names the object it reloads.

## Don't

- No "Something went wrong". Name the noun.
- No full-page reload. Retry only the prop that failed.
- No error code as the message.

## FAQ

**Where does a save error go?**

Under its field (InputError) or in an AlertError at the top of the form. LoadError is for reads.
