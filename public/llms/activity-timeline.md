# ActivityTimeline · Company OS

The audit log as a timeline: day groups, kind icon, actor, from → to pills, the reason.

**One job:** Show the history of one record, or of everything, as the audit log recorded it.
**Category:** page-kit · **Pieces:** 2, 23, 20 · **Exports:** ActivityTimeline, ActivityEntryItem, ActivityEntry · **Tags:** activity, audit, timeline, history, log

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/activity-timeline.json
```

Manual: copy components/company-os/activity-timeline.tsx, components/company-os/activity-entry.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: pill, empty-state.

## Overview

Entries arrive grouped by the server's `day_label`, each with a `kind` (created, updated, completed, deleted, commented, assigned, moved, uploaded), the actor, the sentence, the channel it came through (`via`: web, api, automation, agent), changes as `from → to` pills, and the reason when one was required.

The same component serves a record's Activity tab, the home feed and the audit log page; `showSubject` adds the record link for the cross-record views. Empty renders the EmptyState.

## Examples

### Record activity

```tsx
import { ActivityTimeline } from '@/components/company-os';

<ActivityTimeline entries={activity} />
```

### Audit log with subjects

```tsx
<ActivityTimeline entries={activity} showSubject />
```

## Props

### ActivityTimeline

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `ActivityEntry[]` | — | Newest first, already grouped by `day_label` order. |
| `showSubject` | `boolean` | `false` | Show the record link on each entry. |
| `labels` | `ActivityLabels` | — | `emptyTitle`, `emptyMessage`, `system`. |

### ActivityEntry

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` | `string` | — | Picks icon and colour. Unknown kinds fall back to a neutral activity icon. |
| `actor` | `{ name, initials } | null` | — | Null renders the system label. |
| `action · via` | `string` | — | The sentence after the name, and the channel. |
| `changes` | `{ label, from, to }[]` | — | Field changes; `to: null` renders the label alone. |
| `reason` | `string` | — | The reason stored on serious changes. |
| `at · at_label · time_label · day_label` | `string` | — | ISO time, full label, short time, and the day group, all from the server. |

## Accessibility

- An ordered list per day under an uppercase heading; each entry is a list item.
- The time is a `<time dateTime>` with the full label as its title.
- Icons are decorative; the sentence carries the event.

## Don't

- No date math in React. Day groups and labels come formatted.
- No editing from the timeline. History is stamped, never erased.
- No separate comment thread component; comments are entries of kind commented.

## FAQ

**Why is the reason shown?**

Serious changes (reject, send back, disable, revoke, delete) require one. Showing it is the point of asking.

**Pagination?**

The page paginates; pass the current page of entries. A Pager under the timeline works like under a table.
