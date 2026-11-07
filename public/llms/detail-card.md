# DetailCard · Company OS

A record readout: a titled glass card of label and value pairs. Main facts left, fixed facts right.

**One job:** State a set of labelled facts about one record.
**Category:** page-kit · **Pieces:** 7, 20, 27 · **Exports:** DetailCard, DetailList, Detail · **Tags:** detail, record, readout, description list, show page

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/detail-card.json
```

Manual: copy components/company-os/detail-card.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: cells.

## Overview

A real `<dl>` in a glass card with a small title and an optional action. Two columns on wide screens, one when `compact`, which is the shape of the small side cards on a record page: plan, language, identity, finance, source, onboarding.

**DetailList** is the bare list for use inside another card or a dialog. Null values render the muted dash; a fact with no value is better omitted.

## Examples

### Main card and side card

```tsx
import { DetailCard } from '@/components/company-os';

<DetailCard title="Company" details={[
  { label: 'Legal name', value: 'Halcyon Freight Ltd' },
  { label: 'Registration', value: <span className="font-mono text-xs">REG-2019-4471</span> },
  { label: 'Industry', value: 'Logistics' },
  { label: 'Website', value: 'halcyon.example' },
]} />
<DetailCard compact title="Onboarding" details={[
  { label: 'Reference', value: 'ONB-0007' },
  { label: 'Started by', value: 'Hodan Ali' },
  { label: 'Approved by', value: 'Ayaan Warsame' },
  { label: 'Source', value: 'Referral' },
]} />
```

## Props

### DetailCard

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | The card heading. |
| `details` | `Detail[]` | — | `{ label, value }`. Value is any node; null shows a dash. |
| `compact` | `boolean` | `false` | One column, for side cards. |
| `action` | `ReactNode` | — | Right of the title: an Edit button. |

### DetailList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `details` | `Detail[]` | — | Same rows, no card. |

## Accessibility

- `<dl>`, `<dt>`, `<dd>` markup: a screen reader pairs each label with its value.

## Don't

- No inputs inside a value. Editing is "Update" on the card action, then a form.
- No two records side by side in one card; that is a table.
- No empty rows. Omit, or say "None recorded".

## FAQ

**Where does the Edit button go?**

In `action`. Read-only first, then fields appear; never an always-editable view.
