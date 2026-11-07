# ListSkeleton · Company OS

Placeholder bars for a non-table list while its deferred prop loads.

**One job:** Hold the space of a list that is still arriving.
**Category:** page-kit · **Pieces:** 20 · **Exports:** ListSkeleton · **Tags:** skeleton, loading, deferred, list

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/list-skeleton.json
```

Manual: copy components/company-os/list-skeleton.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: skeleton.

## Overview

Rows of pulsing bars at list-row height. It is the `fallback` of `<Deferred>` and `<WhenVisible>` for boards, timelines and cards. Tables use **DataTableSkeleton**, which keeps the header row.

Skeletons, never spinners inside content. The layout holds its shape so nothing jumps when the rows land.

## Examples

### Deferred board

```tsx
import { ListSkeleton, LoadError } from '@/components/company-os';

<Deferred data="groups" fallback={<ListSkeleton />} rescue={<LoadError prop="groups" noun="tasks" />}>
  <TaskBoard columns={groups ?? []} />
</Deferred>
```

## Props

### ListSkeleton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `number` | `6` | How many bars. |

## Accessibility

- Purely visual; the deferred region announces nothing until real content renders.

## Don't

- No spinner in place of a skeleton.
- No skeleton for a table; use DataTableSkeleton.

## FAQ

**Below the fold?**

`<WhenVisible>` with the same fallback.
