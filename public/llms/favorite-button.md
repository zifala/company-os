# FavoriteButton · Company OS

A star that pins any viewable record or saved view to the sidebar.

**One job:** Toggle one record in the user's favorites.
**Category:** views · **Pieces:** 15 · **Exports:** FavoriteButton · **Tags:** favorite, pin, star, sidebar

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/favorite-button.json
```

Manual: copy components/company-os/favorite-button.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button.

## Overview

An icon button with `aria-pressed`. The page knows whether the record is saved (from the shared `favorites` prop) and posts or deletes on toggle; the sidebar re-renders its Favorites group from the same prop.

## Examples

### On a record header

```tsx
import { FavoriteButton } from '@/components/company-os';

const saved = favorites.find((f) => f.kind === 'project' && f.target_id === project.id);

<FavoriteButton
  saved={saved !== undefined}
  label={project.name}
  onToggle={() => saved
    ? router.delete(favoritesRoutes.destroy(saved.id).url, { only: ['favorites'] })
    : router.post(favoritesRoutes.store().url, { kind: 'project', id: project.id }, { only: ['favorites'] })}
/>
```

## Props

### FavoriteButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `saved` | `boolean` | — | Current state from the shared prop. |
| `label` | `string` | — | The record name, used in the accessible label. |
| `onToggle` | `() => void` | — | The page's request. |
| `addLabel · removeLabel` | `(name) => string` | — | Translated label builders. |

## Accessibility

- `aria-pressed` states the toggle; the label names the record and the action.

## Don't

- No favorite stored in React state alone; the server is the source.
- No star inside table rows.

## FAQ

**What can be favorited?**

Anything the user can view: records and saved views. The server re-checks on every render, so lost access drops the pin.
