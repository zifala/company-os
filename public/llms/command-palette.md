# CommandPalette · Company OS

One ⌘K dialog that finds records, runs actions and goes to pages. The server searches; the nav list supplies Go to.

**One job:** Reach any record, verb or page from the keyboard in one box.
**Category:** shell · **Pieces:** 13 · **Exports:** CommandPalette, useRecordSearch, useShortcuts, goItems, matchesTerm, paletteLabels, PaletteItem, FoundGroup, PaletteLabels, RecordSearch, ShortcutHandlers · **Tags:** palette, search, command, shortcuts, cmdk, go-to

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/command-palette.json
```

Manual: copy components/company-os/command-palette.tsx, components/company-os/command-palette-items.ts, components/company-os/use-record-search.ts, components/company-os/use-shortcuts.ts into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: nav.
shadcn primitives: command, dialog, kbd, skeleton.

## Overview

Three sections in one list, in this order: **record groups** from the server, **Actions** (create verbs, "Show keyboard shortcuts"), **Go to** (every nav item the user may see, with its `G X` key). The palette never fetches. The page passes `onSearch(term)`; the hook debounces 200 ms, asks at 2+ characters, shows two skeleton rows while waiting and one rose line on failure.

`shouldFilter={false}`: the server filters records, the palette filters actions and Go to by label. Running an item closes the dialog and clears the query. Items with a URL go through `onNavigate`; items with a function run it. `useShortcuts` is the one global key listener: ⌘K / Ctrl+K anywhere, `/` `n` `c` `?` and `g`-then-key only when nobody is typing and no dialog is open.

## Examples

### Palette with record search

The demo resolves two sample groups after 300 ms. Type "ha" to see them, "con" for an action and a page.

```tsx
import { CommandPalette, SearchButton, useShortcuts } from '@/components/company-os';
import { navGroups } from '@/components/app-sidebar-items';
import { actionItems } from '@/components/command-palette-items';
import { router, usePage } from '@inertiajs/react';
import { search } from '@/routes';

const { auth } = usePage().props;
const [open, setOpen] = useState(false);

const searchRecords = (term: string) =>
  fetch(search.url({ query: { q: term } }), { headers: { Accept: 'application/json' } })
    .then((response) => response.json())
    .then((body) => body.groups);

useShortcuts({
  groups: navGroups,
  permissions: auth.permissions,
  onPalette: () => setOpen((value) => !value),
  onQuickCreate: () => setCreating(true),
  onHelp: () => setHelp(true),
  onNavigate: (url) => router.visit(url),
});

<SearchButton onClick={() => setOpen(true)} />
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  groups={navGroups}
  permissions={auth.permissions}
  actions={actionItems}
  onSearch={searchRecords}
  onNavigate={(url) => router.visit(url)}
/>
```

## Props

### CommandPalette

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Controlled. The header SearchButton and ⌘K both set it. |
| `onOpenChange` | `(open: boolean) => void` | — | Closing clears the query. |
| `placeholder` | `string` | `'Search a record or type a command'` | Input placeholder. Name the record kinds your product has. |
| `groups` | `NavGroup[]` | — | The sidebar nav list. Go to is derived from it with `visibleGroups`; never a second list. |
| `permissions` | `string[]` | — | Granted permissions. Gates actions and Go to. |
| `actions` | `PaletteItem[]` | — | Create verbs and utilities: `{ label, icon, shortcut?, permission?, anyPermission?, run }`. `run` is a URL or a function. |
| `onSearch` | `(term: string) => Promise<FoundGroup[]>` | — | Record search. Omit it and the palette is actions + Go to only. |
| `onNavigate` | `(url: string) => void` | — | Called with the URL of a record or a URL item. Pass `router.visit`. |
| `labels` | `Partial<PaletteLabels>` | — | title, actions, goTo, failed, empty. English defaults. |

### useShortcuts

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups · permissions` | `NavGroup[] · string[]` | — | Source of the `g`-keys via `goShortcuts`. |
| `onPalette · onQuickCreate · onHelp` | `() => void` | — | ⌘K and `/` · `n` · `?`. |
| `onCreate` | `() => void` | — | `c`, the one primary create. Omit and `c` does nothing. |
| `onNavigate` | `(url: string) => void` | — | Called after `g` then a go-key, within 1.2 s. |

### useRecordSearch

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSearch` | `RecordSearch` | — | Returns `{ query, setQuery, searching, groups, failed }`. 200 ms debounce, 2-character minimum, stale responses dropped. |

## Accessibility

| Keys | Action |
| --- | --- |
| ⌘K / Ctrl+K | Toggle the palette, also while typing in a field. |
| / | Open the palette when not typing. |
| ↑ ↓ | Move through results; the list loops. |
| Enter | Run the selected item. |
| Esc | Close and clear. |
| G then H | Go to Home; each nav item declares its own <code>goKey</code>. |

- The dialog carries a visually hidden title from `labels.title`.
- cmdk marks the list as `role="listbox"` with one `aria-selected` option; group headings are real headings.
- Single-key shortcuts ignore inputs, textareas, selects, contenteditable and any open dialog.

## Don't

- No fetch inside the palette. The page passes `onSearch`.
- No hand-kept Go to list. It is the sidebar nav, gated the same way.
- No go-key from a translated title. The nav item declares `goKey`.
- No search under 2 characters. No search engine until ILIKE is measurably slow.
- No task or row shortcuts in the shell hook. Module keys live with the module.

## FAQ

**Where does the search endpoint live?**

One `GET search?q=` route returning `{ groups }`, each group filtered with the same scope as its index page. The palette is the easiest permission leak; test it.

**How do download links work?**

Give the action a function that sets `window.location`. URL items always go through `onNavigate`.

**Who hosts useShortcuts?**

The app layout, once. It owns the open state of the palette, the quick-create menu and the shortcut sheet.
