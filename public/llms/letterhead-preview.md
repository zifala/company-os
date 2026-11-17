# LetterheadPreview · Company OS

The printed header, live beside the workspace form: legal name, lines, logo.

**One job:** Let the person editing the letterhead see what every invoice and statement will print.
**Category:** organization · **Pieces:** 7, 17 · **Exports:** LetterheadPreview, letterheadPreviewLabels, LetterheadPreviewLabels · **Tags:** letterhead, workspace, print, legal name, logo

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/letterhead-preview.json
```

Manual: copy components/company-os/letterhead-preview.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: print-sheet.

## Overview

Takes the same `Letterhead` the PrintSheet reads, so the workspace page and the print layout cannot drift. Ink on paper, outside the theme, like the sheet itself.

Blank lines are dropped, so an empty tax number does not print an empty row.

## Examples

### In the workspace side column

```tsx
import { LetterheadPreview } from '@/components/company-os';

<LetterheadPreview letterhead={{ legalName: form.data.legal_name, lines: [form.data.address, form.data.registration], logo }} />
```

## Props

### LetterheadPreview

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `letterhead` | `Letterhead` | — | `{ legalName, lines, logo? }` — the PrintSheet type. |
| `labels` | `Partial<LetterheadPreviewLabels>` | — | Card title and hint. |

## Accessibility

- The paper is decorative; the fields beside it are the source of truth.

## Don't

- No second letterhead type. Reuse the PrintSheet one.
- No hardcoded company name in the print layout. It reads WorkspaceSetting::current().

## FAQ

**Where does the logo come from?**

The workspace singleton's media collection. Pass the rendered img as logo.
