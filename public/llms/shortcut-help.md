# ShortcutHelp · Company OS

The ? sheet. Every key the shell answers to, grouped, with the go-keys generated from the nav.

**One job:** Show the keyboard once so people stop using the mouse.
**Category:** shell · **Pieces:** 13 · **Exports:** ShortcutHelp, shellShortcutGroups, shellShortcutLabels, ShortcutGroup, ShellShortcutLabels · **Tags:** shortcuts, keyboard, help, sheet, kbd

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/shortcut-help.json
```

Manual: copy components/company-os/shortcut-help.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: nav.
shadcn primitives: sheet, kbd.

## Overview

A right-hand Sheet with one section per group: a small uppercase heading, then label left and keys right as `Kbd` chips. `shellShortcutGroups(goShortcuts)` builds the two shell groups, **Anywhere** (⌘K, /, N, ?) and **Go to** (G + each nav `goKey`). Modules append their own groups to the array.

Controlled: the layout opens it from `useShortcuts` on `?` and from the "Show keyboard shortcuts" palette action. Every string is a label prop.

## Examples

### Shell groups

```tsx
import { ShortcutHelp, goShortcuts, shellShortcutGroups } from '@/components/company-os';

const groups = [
  ...shellShortcutGroups(goShortcuts(navGroups, auth.permissions), { create: 'Create task' }),
  { name: 'Task under the pointer', items: [{ keys: ['S'], label: 'Change stage' }, { keys: ['A'], label: 'Assign' }] },
];

<ShortcutHelp open={help} onOpenChange={setHelp} groups={groups} />
```

## Props

### ShortcutHelp

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open · onOpenChange` | `boolean · (open) => void` | — | Controlled by the layout. |
| `groups` | `ShortcutGroup[]` | — | `{ name, items: { keys: string[], label }[] }[]`. Keys render as separate chips. |
| `title` | `string` | `'Keyboard shortcuts'` | Sheet title. |

### shellShortcutGroups

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `goShortcuts` | `GoShortcut[]` | — | From `goShortcuts(groups, permissions)`. Empty → no Go to group. |
| `labels` | `Partial<ShellShortcutLabels>` | — | anywhere, goTo, palette, search, quickCreate, help, and `create` for the `C` row (omitted when unset). |

## Accessibility

| Keys | Action |
| --- | --- |
| ? | Open from anywhere when not typing. |
| Esc | Close the sheet. |

- Keys are `<kbd>` elements, read as keys by screen readers.
- The sheet is a Radix dialog: focus moves in, returns to the opener on close.

## Don't

- No keys the app does not handle. The list is documentation of `useShortcuts` and module hooks, nothing more.
- No go-keys typed by hand. They come from the nav list.
- No tooltip version. One sheet, one key to open it.

## FAQ

**Where do module shortcuts go?**

Append a group per module to the array the layout passes. The hook that handles them lives beside that module.
