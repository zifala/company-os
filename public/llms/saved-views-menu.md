# SavedViewsMenu · Company OS

Saved filter sets for a list. The menu knows which one is active by comparing the URL.

**One job:** Save the current query of a list under a name and return to it in one click.
**Category:** views · **Pieces:** 15 · **Exports:** SavedViewsMenu, SaveViewDialog, activeView, viewDefinition, SavedViewItem · **Tags:** saved views, filters, query, share, list

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/saved-views-menu.json
```

Manual: copy components/company-os/saved-views-menu.tsx, components/company-os/save-view-dialog.tsx, components/company-os/saved-view-query.ts into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: filter-bar, field-row.
shadcn primitives: dropdown-menu, dialog, checkbox, input, label, button.

## Overview

A list's URL query is its state, so a saved view is that query under a name. The menu lists personal and shared views, highlights the one whose query equals the current one (ignoring `page` and any `implied` keys), and offers "Save current view", plus Update and Delete when the policy allows.

Picking a view navigates to the list with its query. Saving opens the **SaveViewDialog**; the page posts `viewDefinition(state)` with the name and scope. Delete goes through a ConfirmDialog the page renders.

## Examples

### In the FilterBar end slot

```tsx
import { FilterBar, SavedViewsMenu, viewDefinition } from '@/components/company-os';

<FilterBar
  state={state}
  end={
    <SavedViewsMenu
      state={state}
      views={savedViews.views}
      canShare={savedViews.can_share}
      saving={form.processing}
      saveError={form.errors.name}
      onSave={({ name, shared }) => form.transform(() => ({ name, scope: shared ? 'shared' : 'personal', ...viewDefinition(state) })).post(savedViewsRoutes.store().url)}
      onUpdate={(view) => router.patch(savedViewsRoutes.update(view.id).url, viewDefinition(state))}
      onDelete={setDeleting}
    />
  }
/>
```

## Props

### SavedViewsMenu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `FilterState` | — | The list's current query. |
| `views` | `SavedViewItem[]` | — | `{ id, name, query, is_shared, owner, can_update, can_delete }` from the server. |
| `canShare` | `boolean` | — | Shows the share checkbox in the dialog. |
| `implied` | `string[]` | — | Query keys to ignore when matching, like a container id. |
| `saving · saveError · onSave` | `boolean · string · ({ name, shared }) => void` | — | The save request. |
| `onUpdate · onDelete` | `(view) => void` | — | Update the active view's query; open the delete confirm. |

## Accessibility

- A Radix menu; the shared icon carries "Shared by {owner}" as its label.
- The dialog returns focus to the trigger on close.

## Don't

- No saved view stored in local storage. It is a row with a policy.
- No unknown filter keys saved; the server cleans the definition.
- No delete without the ConfirmDialog.

## FAQ

**Favorite a view?**

The active view can be pinned with FavoriteButton next to the menu; it then appears in the sidebar favorites.
