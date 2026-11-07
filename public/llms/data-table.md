# DataTable · Company OS

The index table frame: sticky header, scrolling rows, pager footer, and an empty state that keeps the table.

**One job:** Frame one paginated table so it fills the page and always shows the shape the data will take.
**Category:** page-kit · **Pieces:** 20 · **Exports:** DataTable, TableEmptyRow, DataTableSkeleton, Paginated, PageLabels · **Tags:** table, index, pagination, empty, skeleton, list

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/data-table.json
```

Manual: copy components/company-os/data-table.tsx, components/company-os/pager.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: table, button, skeleton.

## Overview

Lists are tables. **DataTable** wraps your `<Table>` in a card, keeps the header row sticky while rows scroll, and reads Laravel's paginator for the footer: "Showing 1–25 of 212" with Previous and Next. One table per view, never two stacked.

When there are no rows the table stays. Headers remain, one full-width **TableEmptyRow** says why it is empty and names the next action, the footer reads "0 results". The reader sees the shape the data will take. First use, no results, and no permission are three different messages the page passes in.

Loading is **DataTableSkeleton** inside `<Deferred>`; a failed load is the LoadError with a retry.

## Examples

### Rows and pager

```tsx
import { DataTable, LinkCell, StatusCell, MoneyCell, DateCell } from '@/components/company-os';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<DataTable page={invoices}>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Total</TableHead>
        <TableHead>Issued</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {invoices.data.map((invoice) => (
        <TableRow key={invoice.id}>
          <LinkCell value={{ label: invoice.number, href: show(invoice.id), detail: invoice.customer }} />
          <StatusCell value={invoice.status} />
          <MoneyCell value={invoice.total} />
          <DateCell value={invoice.issued} />
        </TableRow>
      ))}
    </TableBody>
  </Table>
</DataTable>
```

### Empty, first use

The table keeps its headers. The row names the next action.

```tsx
<TableBody>
  {invoices.data.length === 0 && (
    <TableEmptyRow colSpan={4} title="No invoices yet" message="Create the first one from a won deal.">
      {can.create && <Button size="sm">Create invoice</Button>}
    </TableEmptyRow>
  )}
</TableBody>
```

### Loading

```tsx
<Deferred data="invoices" fallback={<DataTableSkeleton />} rescue={<LoadError prop="invoices" noun="invoices" />}>
  …
</Deferred>
```

## Props

### DataTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `Paginated<unknown>` | — | Laravel paginator: from, to, total, prev_page_url, next_page_url. Omit for an unpaginated table. |
| `labels` | `PageLabels` | — | previous, next, showing(from, to, total), none. Pass translated copy. |
| `children` | `ReactNode` | — | The `<Table>`. |

### TableEmptyRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colSpan` | `number` | — | Column count, so the row spans the table. |
| `title` | `string` | — | Why it is empty. |
| `message` | `string` | — | What fills it, or who can. |
| `children` | `ReactNode` | — | The first action when the user may take it, or the active filter chips. |

### DataTableSkeleton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `number` | `6` | Placeholder rows. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Moves through row links, row menus and the pager buttons. |
| Enter | Opens the focused record link. |

- The header row is a real `<thead>` with `<th scope="col">` cells from the ui Table.
- Disabled pager buttons stay in the tab order as disabled buttons, so the reader knows there is no next page.
- The footer count is tabular and announced as text.

## Don't

- No standalone empty card instead of the table.
- No two tables on one view. One table, a type column, a filter.
- No avatars in rows. No column per fact.
- No spinner inside the table. Skeleton rows while loading.
- No sort or page state in React. The query string is the state.

## FAQ

**Where do filters go?**

In the FilterBar above the table, written to the query string.

**Filtered to nothing?**

TableEmptyRow with "No invoices match these filters" and the FilterChips as children, so one click clears them.

**Row click?**

The LinkCell in the primary column opens the record. Rows with more than two actions get one ActionsMenu.
