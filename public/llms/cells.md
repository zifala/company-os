# Cells · Company OS

One cell per data kind. Laravel formats, the cell only places.

**One job:** Render one typed value in one table cell, aligned and styled for its kind.
**Category:** page-kit · **Pieces:** 20 · **Exports:** MoneyCell, NumberCell, DateCell, StatusCell, PersonCell, CodeCell, BooleanCell, LinkCell, TextCell, EmptyValue · **Tags:** table, cell, money, date, status, person, typed

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/cells.json
```

Manual: copy components/company-os/cells.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: pill.
shadcn primitives: table.

## Overview

Every table cell is one of these. Never a bare `<span>`. Each takes a ready shape from the server: `Money` is `{ formatted, currency }`, `Day` is `{ label, relative }`, `Status` is `{ label, color }`. Null renders a muted dash.

Cells stack what belongs together: name over detail, status pill over its date, person over their organisation. One cell, two lines. Never a column per fact, so the table survives a narrow layout.

## Examples

### A row of typed cells

Money right-aligned and tabular. Date with the relative time in the tooltip. Status as a pill. Person as a name.

```tsx
import { LinkCell, StatusCell, PersonCell, MoneyCell, DateCell } from '@/components/company-os';

<TableRow>
  <LinkCell value={{ label: invoice.number, href: show(invoice.id), detail: invoice.customer }} />
  <StatusCell value={invoice.status} detail={invoice.due.label} />
  <PersonCell value={invoice.owner} />
  <MoneyCell value={invoice.total} />
  <DateCell value={invoice.issued} />
</TableRow>
```

## Props

### MoneyCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Money` | — | `{ formatted, currency } | null`. Right-aligned, tabular, bold. |
| `strong` | `boolean` | `true` | Bold value. Off for secondary amounts. |

### NumberCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string | null` | — | Formatted by the server. |
| `unit` | `string` | — | Shown soft after the value: "h", "%". |

### DateCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Day` | — | `{ label, relative } | null`. Relative text in the tooltip. |

### StatusCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Status | null` | — | `{ label, color }` → Pill. |
| `detail` | `string` | — | Small line under the pill: the date it entered this status. |

### PersonCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Person` | — | `{ name, detail? } | null`. A person is a name; no avatar in tables. |

### LinkCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Target` | — | `{ label, href, detail? }`. The primary column, bold, opens the record. |

### CodeCell · BooleanCell · TextCell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string | Flag` | — | CodeCell: mono, muted. BooleanCell: icon + word. |
| `children · detail` | `ReactNode · string` | — | TextCell: main line and optional small line. |

## Accessibility

- Every cell is a real `<td>`; the column header takes the same alignment.
- Boolean shows an icon and a word; the icon never carries the fact alone.
- The relative date lives in `title` so the visible value stays the exact date.

## Don't

- No formatting in React: no number, date or currency formatting, no translation.
- No avatars or images in tables.
- No "submitted 27 Oct" wording in a date cell. The column says what the date is.
- No bare count. A number carries its noun or lives in a Pill.

## FAQ

**Where is PercentCell?**

NumberCell with `unit="%"`. The server sends the formatted number.

**How do I show who is assigned?**

On the record page. Secondary facts are never columns.
