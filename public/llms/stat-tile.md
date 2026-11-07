# StatTile · Company OS

One number with its label, unit and hint. Quiet by default, raised glass above a list.

**One job:** State one figure the server computed.
**Category:** page-kit · **Pieces:** 20 · **Exports:** StatTile · **Tags:** kpi, stat, tile, dashboard, number

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/stat-tile.json
```

Manual: copy components/company-os/stat-tile.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

Value bold and tabular, unit soft after it, label under, hint faint. The quiet variant is a soft slate fill for figures inside a card; `raised` makes it a glass card for the KPI row above a list or a board. With `href` the tile is a link to the list it counts.

The server sends the formatted value. The tile never computes, rounds or formats.

## Examples

### Raised row above a list

```tsx
import { StatTile } from '@/components/company-os';

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatTile raised label="Open deals" value="18" hint="4 closing this week" href={deals.index({ query: { status: 'open' } })} />
  <StatTile raised label="Pipeline" value="412,800" unit="USD" />
  <StatTile raised label="Won this month" value="6" />
  <StatTile raised label="Win rate" value="38" unit="%" hint="last 90 days" />
</div>
```

### Quiet, inside a card

```tsx
<StatTile label="Logged this week" value="31.5" unit="h" />
```

## Props

### StatTile

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | What the number is. |
| `value` | `ReactNode` | — | Formatted by the server. |
| `unit` | `string` | — | Soft text after the value. |
| `hint` | `string` | — | Faint context line. |
| `href` | `Href` | — | Makes the tile a link. |
| `raised` | `boolean` | `false` | Glass card instead of the quiet fill. |

## Accessibility

- A linked tile is one anchor whose text reads value, unit, label and hint in order.
- Numbers use tabular figures so columns of tiles line up.

## Don't

- No big-number hero template: one accent colour per page, and it is not the tile.
- No math in the tile. Trends and deltas arrive from the server as text.
- No icon decoration.

## FAQ

**Delta or trend arrow?**

Send it in `hint` as words ("+3 vs last month"). Arrows and colours would need server-side polarity that the recipe does not define yet.
