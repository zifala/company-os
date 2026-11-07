# RemoteCombobox · Company OS

A searchable picker whose options come from the server as you type.

**One job:** Pick one record from a list too long to send with the page.
**Category:** forms · **Pieces:** 20 · **Exports:** RemoteCombobox, RemoteOption · **Tags:** combobox, search, picker, remote, select

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/remote-combobox.json
```

Manual: copy components/company-os/remote-combobox.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: command, popover.

## Overview

Short lists (up to about seven) use the plain dropdown; longer lists that fit in the page use the Combobox; lists that do not fit use this. It calls `search(term)` after a short debounce, keeps the selected option visible while results change, and can pin `fixed` options ("Unassigned") at the top.

Pickers never render a native `<select>`. The component owns the request timing; the page owns the request.

## Examples

### Pick a company

```tsx
import { RemoteCombobox } from '@/components/company-os';

<RemoteCombobox
  aria-label="Company"
  placeholder="Search companies"
  selected={deal.company ? { value: deal.company.id, label: deal.company.name } : null}
  search={(term) => http.get(pickers.companies({ query: { q: term } }).url)}
  onValueChange={(id) => form.setData('company_id', id)}
/>
```

## Props

### RemoteCombobox

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `search` | `(term) => Promise<RemoteOption[]>` | — | The page's request. Called with "" when the list opens. |
| `selected` | `RemoteOption | null` | — | Kept in the list so the current value always shows. |
| `fixed` | `RemoteOption[]` | — | Pinned first: "Unassigned", "Me". |
| `exclude` | `string` | — | A value to hide, such as the record itself. |
| `debounceMs` | `number` | `150` | Wait before searching. |
| `…Combobox props` | `ComboboxProps` | — | value, onValueChange, placeholder, name, disabled, aria-label. |

## Accessibility

| Keys | Action |
| --- | --- |
| ↑ ↓ · Enter | Move through results and pick one. |
| Esc | Closes the list. |

- Inherits the Combobox contract: a `role="combobox"` trigger and a listbox with a search input.

## Don't

- No native `<select>`.
- No fetching inside the component; it calls what the page gives it.
- No full list sent with the page when a search endpoint exists.

## FAQ

**Create a new record from the picker?**

Pass `onCreate` and `createLabel` from the Combobox props; the typed text becomes a "Create" row.
