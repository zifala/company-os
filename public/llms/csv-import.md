# CsvImport · Company OS

Pick a file, preview what would change, then import. Nothing writes before the preview.

**One job:** Import records from CSV with a dry run first.
**Category:** views · **Pieces:** 15 · **Exports:** CsvImport, ImportPreviewSection, ImportPreview, ImportRowView · **Tags:** import, csv, preview, dry run, upload

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/csv-import.json
```

Manual: copy components/company-os/csv-import.tsx, components/company-os/import-preview.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: field-row, empty-state, pill.
shadcn primitives: button, input, label, select, table.

## Overview

A file field, a choice for rows that already exist (skip or update), and "Preview import". The page posts the file with `dry_run`; the server answers with a plan of **New**, **Updates**, **Skipped** and **Rows with errors**, each a table with the line number, the name, a detail column and a note. Only then does "Import N contacts" appear.

The import runs through the normal Create and Update Actions, so every row is guarded and audited, with one summary event on top.

## Examples

### Import contacts

```tsx
import { CsvImport } from '@/components/company-os';

<CsvImport
  noun="contacts"
  help="Columns: name, email, phone, company. Header row required."
  detailLabel="Email"
  preview={importPreview}
  processing={form.processing}
  fileError={form.errors.file}
  onPreview={(file, updateExisting) => post(file, { dry_run: true, update_existing: updateExisting })}
  onImport={(file, updateExisting) => post(file, { dry_run: false, update_existing: updateExisting })}
/>
```

## Props

### CsvImport

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `noun` | `string` | — | Plural noun for the import button. |
| `help` | `string` | — | Expected columns, one line. |
| `detailLabel` | `string` | — | Header of the preview's detail column. |
| `preview` | `ImportPreview | null` | — | The plan from the dry run, or null. |
| `processing · fileError` | `boolean · string` | — | Request state and the file error. |
| `onPreview · onImport` | `(file, updateExisting) => void` | — | The page posts with `forceFormData`. |

### ImportPreviewSection

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `preview · detailLabel · labels` | `ImportPreview · string · ImportPreviewLabels` | — | Standalone preview tables. |

## Accessibility

- Four real tables with headers; error notes are text, not colour alone.

## Don't

- No import without a preview.
- No invented records for unknown lookups; the row imports with a warning instead.
- No details of a matched record the user cannot see.

## FAQ

**File size?**

The server caps at 2 MB and 1000 rows and returns the message on `file`.
