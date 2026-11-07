# PageHeader · Company OS

The one h1 of a page, with its own create and export actions on the right.

**One job:** Name the page and hold the actions that belong to the whole page.
**Category:** page-kit · **Pieces:** 20 · **Exports:** PageHeader · **Tags:** header, title, h1, create, actions

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/page-header.json
```

Manual: copy components/company-os/page-header.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

One `<h1>` on the left, optional `meta` beside it (a status pill, a reference), and the page actions on the right. Nothing sits above the title: no breadcrumb, no eyebrow, no section label. The active sidebar item already says where you are.

The header owns the page's "+ Create". The app header never carries a create button; the sidebar carries one global "New". Export, saved views and filters live in the **FilterBar** below, not here.

## Examples

### Index page

Title plus the page's own create action.

```tsx
import { PageHeader } from '@/components/company-os';

<PageHeader title="Contacts">
  {can.create && <Button><PlusIcon /> Create contact</Button>}
</PageHeader>
```

### Record page

Meta beside the title, the actions menu on the right.

```tsx
<PageHeader title={contact.name} meta={<Pill name="Active" color="emerald" />}>
  <Button variant="outline">Edit</Button>
  <ActionsMenu items={[{ label: 'Deactivate contact', destructive: true, onSelect: open }]} />
</PageHeader>
```

## Props

### PageHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The page name. A fixed label, never data: "Contacts", not "42 contacts". |
| `meta` | `ReactNode` | — | Small facts beside the title: a status pill, a reference code. |
| `children` | `ReactNode` | — | Page actions, right-aligned. Primary create first, then outline buttons, then the "…" menu. |

## Accessibility

- Renders the page's only `<h1>`. Sections below start at `<h2>`.
- Actions are real buttons or links; the header adds no landmarks of its own.

## Don't

- No breadcrumb, kicker, date line or description above or under the title.
- No data in the title. The count goes in the table footer, the status in `meta`.
- No filters or search in the header. That is the FilterBar.
- No create button anywhere else on the page.

## FAQ

**Where does the subtitle go?**

Nowhere. The heading speaks alone. Explanation belongs in an empty state or a field hint.

**Full-page form?**

Same header, sticky at the top, with Cancel and Save as its children. Never a footer bar.
