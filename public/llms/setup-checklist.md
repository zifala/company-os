# SetupChecklist · Company OS

Steps that tick from real data, each with a link to where it gets done, and one "Finish setup".

**One job:** Walk the super admin through the first configuration without storing a single tick.
**Category:** setup · **Pieces:** 8 · **Exports:** SetupChecklist, SetupStep, SetupLabels · **Tags:** setup, checklist, onboarding, super admin, first run

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/setup-checklist.json
```

Manual: copy components/company-os/setup-checklist.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: pill.
shadcn primitives: button.

## Overview

The server computes every step: `done: true` from a query, `false` when the data is missing, `null` for review-only steps that never tick. Each row shows the state as a pill and one outline button per link into the page that completes it. Nothing blocks "Finish setup".

The home route redirects the super admin here until `setup_finished_at` is stamped. Step-specific panels (test email, services) render as children under the list.

## Examples

### First run

```tsx
import { SetupChecklist } from '@/components/company-os';

<SetupChecklist steps={steps} finishing={form.processing} onFinish={() => form.post(setup.finish().url)} />
```

## Props

### SetupChecklist

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `SetupStep[]` | — | `{ key, title, done: boolean | null, links: { label, href }[] }`. |
| `onFinish · finishing` | `() => void · boolean` | — | The finish request. |
| `labels` | `SetupLabels` | — | done, todo, review, finish. |
| `children` | `ReactNode` | — | Panels between the list and the finish button. |

## Accessibility

- An ordered list; each state is a word in a pill, with the icon as decoration.

## Don't

- No stored "step done" flags. A query never lies.
- No blocking the finish on review-only steps.
- No global redirect middleware; only the home route redirects.

## FAQ

**Run it again later?**

Organization → Workspace keeps an "Open setup" link; the page renders the same component.
