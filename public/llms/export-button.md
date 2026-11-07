# ExportButton · Company OS

A plain download link styled as an outline button. Exports what the list shows.

**One job:** Download the current list as CSV.
**Category:** views · **Pieces:** 15 · **Exports:** ExportButton · **Tags:** export, csv, download

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/export-button.json
```

Manual: copy components/company-os/export-button.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button.

## Overview

An `<a download>`, nothing more. The href carries the list's current filters so the file matches the screen; the server streams UTF-8 with a BOM, guards formula cells, and caps the rows.

## Examples

### Next to the filters

```tsx
import { ExportButton } from '@/components/company-os';

<FilterBar state={state} end={<ExportButton href={contacts.export.url({ query: filters })} />} />
```

## Props

### ExportButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | The export route with the current query. |
| `label` | `string` | `'Export'` | Button text. |

## Accessibility

- A real link: it works with middle-click and is announced as a download.

## Don't

- No client-side CSV building.
- No export of more than the user may see; the server applies the same scope as the list.

## FAQ

**Excel?**

CSV opens in Excel; the BOM keeps non-Latin text intact.
