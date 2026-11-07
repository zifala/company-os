# Pill · Company OS

A tinted label for a status, a stage or a count. The tint is the colour; there is no dot.

**One job:** State one status or category in one word.
**Category:** page-kit · **Pieces:** 20 · **Exports:** Pill, pillTint, pillSolid, PillColor · **Tags:** status, badge, pill, label, stage

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/pill.json
```

Manual: copy components/company-os/pill.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

Six colours, each a 10% tint with the matching text: **slate**, **indigo**, **cyan**, **emerald**, **rose**, **amber**. The colour comes from the server with the label (`{ label, color }`), the same name a company picked for its stage or priority in Setup. React never maps a status name to a colour.

The pill carries status, category and small counts ("3 projects"). It never carries an action and never stands in for a button. `pillTint` and `pillSolid` expose the same palette for icon chips and board column dots.

## Examples

### Colours

```tsx
import { Pill } from '@/components/company-os';

<Pill name="Draft" />
<Pill name="Submitted" color="indigo" />
<Pill name="In review" color="cyan" />
<Pill name="Approved" color="emerald" />
<Pill name="Overdue" color="amber" />
<Pill name="Rejected" color="rose" />
```

### Count

A number carries its noun. Never a bare count in a table.

```tsx
<Pill name="projects" count={3} color="indigo" />
```

## Props

### Pill

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The word. Translated by the server. |
| `color` | `string` | `'slate'` | slate · indigo · cyan · emerald · rose · amber. Unknown names fall back to slate. |
| `count` | `number` | — | Bold tabular number before the name. |
| `className` | `string` | — | Extra classes. |

## Accessibility

- The label is the information; the tint is supplementary. A screen reader hears the word.
- Every text-on-tint pair stays above 4.5:1 on white and on the slate canvas.

## Don't

- No dot before the text. The tint carries the colour.
- No solid fills. A pill is a tint with ink text.
- No colour decided in React from a status name. The server sends it.
- No pill as a button or link.

## FAQ

**How do I colour a stage a company named itself?**

Setup stores a colour per stage, priority and label. The server sends it with the row; the pill never sees the stage name.

**Where do the colours come from?**

The brand palette: slate neutrals, indigo accent, cyan for information, emerald for success, rose for errors, amber for warnings.
