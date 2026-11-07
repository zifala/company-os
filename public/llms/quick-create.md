# QuickCreate · Company OS

The one global New menu, top of the sidebar. Items the user may create, nothing else.

**One job:** Create any record from anywhere in two keystrokes.
**Category:** shell · **Pieces:** 13 · **Exports:** QuickCreate, QuickCreateItem · **Tags:** create, new, menu, sidebar, shortcut

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/quick-create.json
```

Manual: copy components/company-os/quick-create.tsx, hooks/use-controllable-open.ts into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: dropdown-menu, sidebar.

## Overview

A primary sidebar button "New" with a dropdown of `{ kind, label, icon, shortcut?, onSelect }` items. The page filters items by the shared `can_create` map before passing them; with none left the button is not rendered. Small records open a dialog in place, big ones visit their create page. Both are the page's `onSelect`.

Controlled or not: pass `open` and `onOpenChange` so `useShortcuts` can open it on `n`. One item carries the `C` shortcut, the record people make most. The button is `data-tour="quick-create"`.

## Examples

### Three kinds

```tsx
import { QuickCreate } from '@/components/company-os';

const { can_create } = usePage().props;
const [menuOpen, setMenuOpen] = useState(false);

const items = [
  { kind: 'contact', label: t('Contact'), icon: Contact, shortcut: 'C', onSelect: () => setDialog('contact') },
  { kind: 'deal', label: t('Deal'), icon: Handshake, onSelect: () => router.visit(deals.create()) },
  { kind: 'project', label: t('Project'), icon: FolderKanban, onSelect: () => router.visit(projects.create()) },
].filter((item) => can_create[item.kind]);

<QuickCreate items={items} label={t('New')} open={menuOpen} onOpenChange={setMenuOpen} />
```

## Props

### QuickCreate

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `QuickCreateItem[]` | — | Already filtered by permission. Empty renders nothing. |
| `label` | `string` | `'New'` | Button text and tooltip. |
| `open · onOpenChange` | `boolean · (open) => void` | — | Optional control for the `n` shortcut. |

## Accessibility

| Keys | Action |
| --- | --- |
| N | Open the menu from anywhere (via useShortcuts). |
| ↑ ↓ Enter | Pick an item. |

- Collapsed sidebar shows the label as a tooltip; the button keeps "New" as its name.
- Shortcuts shown in the menu are hints; the key handling lives in `useShortcuts`.

## Don't

- No create button in the header. This is the one.
- No permission check inside. The page filters with `can_create`.
- No dialog rendered inside the menu. Dialogs live beside it, opened by state, or they unmount with the menu.

## FAQ

**Dialog or page?**

A record with up to five fields opens a FormDialog in place. More than that visits its create page.
