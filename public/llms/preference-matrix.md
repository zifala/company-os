# PreferenceMatrix · Company OS

Events down, channels across, one switch per cell. Quiet hours said once, under the grid.

**One job:** Let each person pick which events reach them on which channel.
**Category:** access · **Pieces:** 10 · **Exports:** PreferenceMatrix, preferenceMatrixLabels, PreferenceChannel, PreferenceEvent, PreferenceMatrixLabels, PreferenceValue · **Tags:** notifications, preferences, matrix, channels, email, settings

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/preference-matrix.json
```

Manual: copy components/company-os/preference-matrix.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: switch.

## Overview

Rows are `NotificationEvent` cases, grouped by module when `group` is set. Columns are `NotificationChannel` cases. The server sends the effective value per cell: a saved row, or the default (in-app on, email for the email-by-default events, opt-in events off).

A channel the user cannot receive yet (WhatsApp without a number) is greyed with a hint on its header. Saving posts the whole matrix; `UpdateNotificationPreferences` writes one row per cell in a transaction.

## Examples

### Settings · Notifications

```tsx
import { PreferenceMatrix } from '@/components/company-os';
import { useForm } from '@inertiajs/react';

const form = useForm({ preferences });

<PreferenceMatrix
  events={events}
  channels={channels}
  value={form.data.preferences}
  onChange={(preferences) => form.setData('preferences', preferences)}
  disabled={form.processing}
/>
```

## Props

### PreferenceMatrix

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `PreferenceEvent[]` | — | `{ key, label, hint?, group? }`. Consecutive events with the same group share a heading. |
| `channels` | `PreferenceChannel[]` | — | `{ key, label, available?, unavailableHint? }`. |
| `value · onChange` | `PreferenceValue` | — | `{ [event]: { [channel]: boolean } }`. A missing cell reads as off. |
| `disabled` | `boolean` | `false` | While saving. |
| `labels` | `PreferenceMatrixLabels` | — | event column header, quietHours line (`null` hides it). |

## Accessibility

- A real table: events are row headers, channels column headers, module names colgroup headers.
- Each switch is labelled "event: channel".

## Don't

- No switch for in-app on reminders that must arrive; leave the event out instead.
- No delaying in-app for quiet hours. Only channels that buzz a phone wait.
- No guessing the default in React. The server sends the effective value.

## FAQ

**Where is the matrix?**

Settings → Notifications, per user. Never in Organization.
