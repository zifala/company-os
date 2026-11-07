# FilterBar · Company OS

Search, inline filters, an overflow popover, and removable chips. The query string is the state.

**One job:** Narrow one index table from the URL, one field per filterable column.
**Category:** page-kit · **Pieces:** 20, 15 · **Exports:** FilterBar, FilterChips, FilterControl, applyFilters, activeFilters, FilterState, FilterField · **Tags:** filters, search, chips, query string, index

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/filter-bar.json
```

Manual: copy components/company-os/filter-bar.tsx, components/company-os/filter-chips.tsx, components/company-os/filter-control.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, input, label, popover, select, command.

## Overview

A page declares its filters once as a `FilterState`: the index `url`, the current `filters` from the query string, and the `fields` it offers. Every filterable column the table shows gets a field; never only one. Inline fields sit in the bar, the rest fold into a "Filters" popover that counts its active fields.

Every change calls `applyFilters`, which writes the merged query to the URL with `preserveState` and `replace`, so Laravel re-renders the deferred rows, the back button stays sane, and a saved view can compare the same query later. Empty values are dropped so URLs stay short.

Active filters render as chips under the bar with a remove button each and one "Clear filters". A value equal to a field's `defaultValue` is not a chip. The same chips go inside **TableEmptyRow** when the filters hide every row.

## Examples

### Index filters

Search on Enter, status and owner inline, source and period in the popover. Chips appear as filters are set.

```tsx
import { FilterBar } from '@/components/company-os';
import type { FilterState } from '@/components/company-os';

const state: FilterState = {
  url: contacts.index().url,
  filters,
  searchPlaceholder: 'Search contacts',
  fields: [
    { key: 'status', label: 'Status', inline: true, placeholder: 'All statuses', options: lookups.statuses },
    { key: 'owner', label: 'Owner', inline: true, placeholder: 'Anyone', options: lookups.owners, searchable: true },
    { key: 'source', label: 'Source', placeholder: 'Any source', options: lookups.sources },
    { key: 'period', label: 'Created', placeholder: 'Any time', options: lookups.periods },
  ],
};

<FilterBar state={state} end={<ExportButton href={contacts.export.url({ query: filters })} />} />
```

## Props

### FilterBar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `FilterState` | — | `{ url, filters, fields, searchPlaceholder? }`. A search box renders only when `searchPlaceholder` is set. |
| `end` | `ReactNode` | — | Right slot: saved views menu, export button. |
| `labels` | `FilterBarLabels` | — | `filters`, `clearFilters`, `search`. Pass translated copy. |

### FilterField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `key · label` | `string` | — | Query key and visible label. |
| `options` | `Option[]` | — | `{ value, label }` from the server. |
| `inline` | `boolean` | — | In the bar instead of the popover. |
| `searchable` | `boolean` | — | Combobox instead of the plain dropdown. Use beyond ~7 options. |
| `text` | `boolean` | — | A free text input, applied on Enter. |
| `defaultValue` | `string` | — | The value that counts as "no filter"; never shown as a chip. |

### applyFilters · activeFilters

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `applyFilters(state, changes)` | `function` | — | Merges, drops empty values, navigates with preserveState + replace. |
| `activeFilters(state)` | `ActiveFilter[]` | — | The chips: search first, then each field with a non-default value. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter | Applies the search or a text field. |
| Tab | Moves through fields, the Filters button, chips and their remove buttons. |

- Every control carries an `aria-label` from its field label; inline fields have no visible label by design.
- Each chip's remove button is named "Remove <filter>".
- Dropdowns and the popover render in portals, so they escape scrolling containers.

## Don't

- No filter state in React. The URL is the state; Laravel reads it.
- No native `<select>`. Plain dropdown for short lists, combobox beyond ~7.
- No single-filter bars. Every filterable column the table shows gets a field.
- No filtering on the client. The server narrows the rows.

## FAQ

**Where do saved views plug in?**

SavedViewsMenu takes the same FilterState and compares its query to each saved view; put it in the `end` slot.

**How does the table know it is filtered to nothing?**

The page checks `activeFilters(state).length` and renders TableEmptyRow with "No X match these filters" and the FilterChips as children.
