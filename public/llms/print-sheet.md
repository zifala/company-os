# PrintSheet · Company OS

The A4 sheet: letterhead, repeating header and footer, title and number, lines, totals, the stamp.

**One job:** Give every official document one print layout that the browser turns into a PDF.
**Category:** views · **Pieces:** 17 · **Exports:** PrintSheet, printSheetLabels, Letterhead, PrintMeta, PrintSheetLabels, PrintLines, PrintTotals, PrintBlock, PrintColumn, PrintRow, PrintTotal · **Tags:** print, pdf, a4, invoice, statement, letterhead

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/print-sheet.json
```

Manual: copy components/company-os/print-sheet.tsx, components/company-os/print-lines.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button.

## Overview

In a product the print route is Blade: `resources/views/print/layout.blade.php`, no bundle, prints at once. This component is the same structure in React, for previews and as the reference the Blade view copies: a frame table whose `thead` and `tfoot` repeat on every page, a toolbar that hides when printing, a faint stamp for draft or void.

Print is ink on paper, so the sheet uses black, white and grey hairlines, not the theme. `PrintLines`, `PrintTotals` and `PrintBlock` never split across a page.

## Examples

### Draft invoice

```tsx
import { PrintLines, PrintSheet, PrintTotals } from '@/components/company-os';

<PrintSheet letterhead={workspace.letterhead} title={t('Invoice')} number={invoice.number} meta={invoice.meta} stamp={invoice.stamp} footer={invoice.footer}>
  <PrintLines columns={columns} rows={invoice.lines} />
  <PrintTotals totals={invoice.totals} />
</PrintSheet>
```

## Props

### PrintSheet

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `letterhead` | `Letterhead` | — | `{ legalName, lines, logo? }` from workspace settings. Nothing hardcoded. |
| `title · number` | `string` | — | Document name and number. |
| `meta` | `PrintMeta[]` | — | Issued, due, terms. Formatted on the server. |
| `stamp` | `string | null` | `null` | Draft or void; null when final. |
| `footer` | `string[]` | — | Legal name, printed at and by, document number. |
| `onPrint · labels` | `() => void · PrintSheetLabels` | — | Defaults to window.print(); print, hint. |

### PrintLines · PrintTotals · PrintBlock

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns · rows` | `PrintColumn[] · PrintRow[]` | — | `{ key, label, numeric?, width? }` and `{ id, cells }`. Numeric columns right-align with tabular figures. |
| `totals` | `PrintTotal[]` | — | `{ label, value, strong? }`. Strong gets the rule above. |
| `title · children` | `string · ReactNode` | — | A small labelled block: bill to, pay to, signatures. |

## Accessibility

- The stamp is aria-hidden; the status lives in the text.
- The toolbar and the back button hide under print media.

## Don't

- No PDF package until an attachment or archive needs one. Then one renderer takes this same layout.
- No brand fills on paper.
- No audit row or state change on print. Issue and send are their own Actions.

## FAQ

**Page numbers?**

@page margin boxes in the Blade view. Chromium prints them; tell users to print from Chrome or Edge.
