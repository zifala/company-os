# EmptyState · Company OS

An icon chip, why the region is empty, and the first action. For regions that are not tables.

**One job:** Say why a region is empty and what fills it.
**Category:** page-kit · **Pieces:** 20 · **Exports:** EmptyState · **Tags:** empty, first use, no results, state

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/empty-state.json
```

Manual: copy components/company-os/empty-state.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

A glass panel with an icon chip, a title that says why the region is empty, and a message that names what fills it. Children hold the first action when the user may take it; otherwise the message says who can.

Three empties are three different messages: first use ("No projects yet"), no results ("No projects match these filters"), and no permission ("Ask an admin for access to projects"). Inside a table use **TableEmptyRow** instead, so the headers stay and the reader sees the shape the data will take.

## Examples

### First use with an action

```tsx
import { EmptyState } from '@/components/company-os';

<EmptyState icon={FolderKanbanIcon} title="No projects yet" message="Projects group tasks, documents and time for one piece of work.">
  {can.create && <Button><PlusIcon /> Create project</Button>}
</EmptyState>
```

### Without permission

The message names who can add one; no button.

```tsx
<EmptyState icon={LockIcon} title="No access to invoices" message="Ask a finance manager to grant Invoices · view." />
```

## Props

### EmptyState

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | — | Rendered in the primary tint chip. |
| `title` | `string` | — | Why it is empty. |
| `message` | `string` | — | What fills it, or who can. |
| `children` | `ReactNode` | — | The first action, or active filter chips. |

## Accessibility

- The icon is decorative; the title and message carry the information.
- The action is a real button or link with the verb and the object in its label.

## Don't

- No EmptyState in place of a table. Keep the table, use TableEmptyRow.
- No "Nothing here" or "No data". Say why and what fills it.
- No illustration, no mascot.
- No explanation paragraphs anywhere else on the page; the empty state is where explanation lives.

## FAQ

**Board or timeline empty?**

EmptyState. Those are not tables.

**Message with a link?**

The message is a string; put a text link in children when the place that fills the list is elsewhere (triage, import).
