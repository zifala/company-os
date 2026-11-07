# ActionsMenu · Company OS

The "…" menu for a row or a record header. Destructive items in rose, dialogs opened by state.

**One job:** Hold the secondary and destructive actions of one record.
**Category:** page-kit · **Pieces:** 20 · **Exports:** ActionsMenu, ActionsMenuItem · **Tags:** menu, row actions, dropdown, destructive

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/actions-menu.json
```

Manual: copy components/company-os/actions-menu.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, dropdown-menu.

## Overview

An icon-only trigger and a list of `{ label, onSelect, destructive? }`. A row with more than two actions gets one of these, never a row of buttons. A menu with one non-destructive item is a button instead.

Dialogs never live inside the menu: a menu item sets state, the ReasonDialog or ConfirmDialog renders outside with `open` and `onOpenChange`. The menu is non-modal so a dialog it opens keeps focus right.

## Examples

### Record header

```tsx
import { ActionsMenu, ReasonDialog } from '@/components/company-os';

const [deactivating, setDeactivating] = useState(false);

<ActionsMenu items={[
  { label: 'Export contact', onSelect: () => (window.location.href = exportUrl) },
  { label: 'Merge into another', onSelect: () => setMerging(true) },
  { label: 'Deactivate contact', destructive: true, onSelect: () => setDeactivating(true) },
]} />
<ReasonDialog open={deactivating} onOpenChange={setDeactivating} … />
```

## Props

### ActionsMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ActionsMenuItem[]` | — | `{ label, onSelect, destructive? }`. Labels name verb + object. |
| `label` | `string` | `'More actions'` | The trigger's accessible name. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter · Space | Opens the menu. |
| ↑ ↓ | Moves between items. |
| Esc | Closes it. |

- The icon-only trigger carries `aria-label`; the menu is a Radix menu with full roving focus.

## Don't

- No dialog rendered inside a menu item; it unmounts with the menu.
- No serious status change from a table row. Deactivate, delete and reject live on the record page.
- No icons in menu items; the label is enough.

## FAQ

**One action only?**

Render a button. The menu is for three or more, or for anything destructive.
