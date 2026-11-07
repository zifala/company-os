# AppTour · Company OS

One short overlay tour over the shell, once per user. Hidden targets are skipped by size.

**One job:** Walk a new user through navigation, New and search in under a minute.
**Category:** shell · **Pieces:** 9 · **Exports:** AppTour, visibleSteps, tourLabels, TourStep, TourLabels · **Tags:** tour, onboarding, driver, overlay, walkthrough

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/app-tour.json
```

Manual: copy components/company-os/app-tour.tsx into your project (plus lib/navigation.tsx and the token set).

## Overview

Mounted once in the app layout. When `run` is true it waits 1.2 s for deferred props to render, collects the steps whose `[data-tour]` element has a box, and drives them with driver.js: slate overlay, progress, no interaction with the highlighted element. Closing early counts as finished; `onFinish` fires either way.

The page decides when to run: shared `showTour` from the user row or `?tour=1` for a replay. A ref keyed by the current URL stops a second run on partial reloads. Shell elements already carry `data-tour`: `sidebar`, `quick-create`, `search`, `bell`, plus each nav item's `tour` key.

## Examples

### Two steps

The demo runs over the search button and the stat row after 100 ms.

```tsx
import { AppTour } from '@/components/company-os';
import { router, usePage } from '@inertiajs/react';
import { finish } from '@/routes/tour';

const { url, props } = usePage();
const isReplay = new URLSearchParams(url.split('?')[1]).get('tour') === '1';

<AppTour
  run={url.startsWith('/dashboard') && (props.showTour || isReplay)}
  steps={[
    { target: 'sidebar', title: t('tour.sidebar.title'), description: t('tour.sidebar.body') },
    { target: 'quick-create', title: t('tour.new.title'), description: t('tour.new.body') },
    { target: 'search', title: t('tour.search.title'), description: t('tour.search.body') },
  ]}
  labels={{ next: t('tour.next'), back: t('tour.back'), done: t('tour.done') }}
  onFinish={() => {
    if (!isReplay) {
      router.post(finish.url(), {}, { preserveState: true, preserveScroll: true });
    }
  }}
/>
```

## Props

### AppTour

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` | `TourStep[]` | — | `{ target, title, description }`. `target` matches `data-tour="…"`. Four to six steps. |
| `run` | `boolean` | — | Start when true and not yet started on this URL. |
| `onFinish` | `() => void` | — | After Done, Esc or an overlay click. Post `tour.finish` unless replaying. |
| `labels` | `Partial<TourLabels>` | — | next, back, done. |
| `delayMs` | `number` | `1200` | Wait before collecting targets, so deferred sections exist. |

## Accessibility

| Keys | Action |
| --- | --- |
| → / Enter | Next step. |
| ← | Previous step. |
| Esc | End the tour. |

- Animation follows `prefers-reduced-motion`.
- The popover is a driver.js dialog with the step title as its heading; the highlighted element is not interactive during the step.
- Steps whose element is hidden (collapsed sidebar, missing permission) are dropped, never shown pointing at nothing.

## Don't

- No seen flag in localStorage. The user row stores `tour_seen_at`, once across devices.
- No permission list in the tour. Visibility by element size only.
- No tour on the setup page. Super admins see it after setup is finished.
- No colours in the step config. The overlay uses `--color-slate-900`.

## FAQ

**Replay?**

Link "Take the tour" in the user menu to `dashboard?tour=1`. Same component, same steps; the page skips the post.

**Why no steps appeared?**

Every target had no box after the delay. Check the `data-tour` keys and that the elements render on that page.
