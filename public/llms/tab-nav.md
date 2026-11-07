# TabNav · Company OS

Tabs that are routes. The active tab comes from the URL, never from state.

**One job:** Switch between the sections of one record or one area, each on its own URL.
**Category:** page-kit · **Pieces:** 20 · **Exports:** TabNav, TabLink · **Tags:** tabs, routes, record page, navigation

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/tab-nav.json
```

Manual: copy components/company-os/tab-nav.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

Each tab is a `Link` to a route. The active tab is the one whose path and query match the current URL, so a reload, a bookmark and the back button all land on the right section. An optional count sits beside the label.

Tabs split a record page into sections (Overview, Meetings, Activity) or an area into reports. A tab never repeats a sidebar item: one home per page.

## Examples

### Record sections

```tsx
import { TabNav } from '@/components/company-os';

<TabNav
  label="Contact sections"
  tabs={[
    { label: 'Overview', href: contacts.show(contact.id) },
    { label: 'Meetings', href: contacts.meetings(contact.id), count: contact.meetings_count },
    { label: 'Activity', href: contacts.activity(contact.id) },
  ]}
/>
```

## Props

### TabNav

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `TabLink[]` | — | `{ label, href, count? }`. Count shows when above zero. |
| `label` | `string` | — | The `aria-label` of the nav. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab · Enter | Moves between tabs and opens one. |

- A `<nav aria-label>` of links; the active one carries `aria-current="page"`.
- Links, not buttons: the browser owns history and middle-click.

## Don't

- No `useState` tabs. A tab without a URL is a defect.
- No tab that repeats a sidebar item.
- No icons in tabs.

## FAQ

**Tabs with query strings?**

Supported. A tab href like `?tab=team` is active when the current query carries the same pair; the bare href is active only when the query is empty.
