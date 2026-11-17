# AuditLogTable · Company OS

One table of every event: when, who and through which channel, the event label over its raw name, the subject, the reason.

**One job:** Show the audit log the way the audit recipe stores it, filterable and exportable, without a second design per module.
**Category:** organization · **Pieces:** 2, 23 · **Exports:** AuditLogTable, auditLogLabels, AuditEvent, AuditLogLabels · **Tags:** audit, activity, log, events, reason, via, channel, csv

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/audit-log-table.json
```

Manual: copy components/company-os/audit-log-table.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: cells, data-table.
shadcn primitives: table.

## Overview

The page behind `reports.audit`. Rows arrive from `AuditLog::page()`, 50 per page, newest first, in the viewer's timezone. The label comes from `lang/*/audit.php`; the raw event name stays underneath because event names are a public contract.

The channel line under the person reads the server's `via` string — "via automation “Overdue chaser”" — and is absent for web. A row with no causer is the system. Empty keeps the table: the filters stay above it.

## Examples

### Under the filter bar

```tsx
import { AuditLogTable, ExportButton, FilterBar } from '@/components/company-os';

<FilterBar state={filters} end={<ExportButton href={exportUrl} label="Export CSV" />} />
<AuditLogTable page={events} events={events.data} />
```

### Nothing matches

```tsx
<AuditLogTable page={empty} events={[]} />
```

## Props

### AuditLogTable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `Paginated<unknown>` | — | The paginator, for the footer count and pager. |
| `events` | `AuditEvent[]` | — | `{ id, at, actor, event: { name, label }, subject, via, reason }`. `actor` null means the system. |
| `empty` | `ReactNode` | — | Extra content in the empty row, e.g. a Clear filters button. |
| `pageLabels` | `PageLabels` | — | Footer and pager copy. |
| `labels` | `Partial<AuditLogLabels>` | — | Column heads, the system name, empty copy. |

## Accessibility

- The full timestamp is the cell text; the relative time is its title.
- Subjects are links to the record, labelled by the record name.

## Don't

- No edit or delete on a row. Stamp, never erase.
- No raw enum value for the channel. The server sends the translated line.
- No secrets, tokens or long text bodies in the reason column — the recipe never logs them.

## FAQ

**Where do the filters come from?**

FilterBar with person, event prefix (distinct prefixes before the first dot), channel, from and to. The same filters drive the CSV export.

**Why both label and raw name?**

People read the label; integrators, webhooks and reports key on the raw name. Unknown events fall back to the raw name as the label.
