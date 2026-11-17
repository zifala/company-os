# CalendarFeedCard · Company OS

The personal ICS link: off or on, create, the new URL shown once, reset and revoke behind a confirm.

**One job:** Let each person put their own events, reminders and due dates in the calendar app they already use.
**Category:** organization · **Pieces:** 12 · **Exports:** CalendarFeedCard, calendarFeedLabels, CalendarFeedLabels · **Tags:** calendar, ics, feed, subscribe, settings, token

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/calendar-feed-card.json
```

Manual: copy components/company-os/calendar-feed-card.tsx into your project (plus lib/navigation.tsx and the token set).
Company OS dependencies: confirm-dialog, secret-reveal.
shadcn primitives: button.

## Overview

Lives on `Settings/notifications`. Create posts to `calendar-feed.store` behind password confirm; the controller flashes `calendarFeedUrl` and the card shows it once in a SecretReveal. Only the sha256 of the token is stored.

Reset is create again — the old link 404s at once — so it asks first. Revoke deletes the hash and asks first too.

## Examples

### In personal settings

```tsx
import { CalendarFeedCard } from '@/components/company-os';

<CalendarFeedCard
  active={calendarFeed.active}
  url={flash.calendarFeedUrl ?? null}
  processing={processing}
  onCreate={() => router.post(route('calendar-feed.store'))}
  onRevoke={() => router.delete(route('calendar-feed.destroy'))}
/>
```

## Props

### CalendarFeedCard

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `boolean` | — | A hash exists for this user. |
| `url` | `string | null` | — | The flashed URL, only on the response after create. |
| `processing` | `boolean` | `false` | Disables the buttons. |
| `onCreate` | `() => void` | — | Create and reset both call it. |
| `onRevoke` | `() => void` | — | After the confirm. |
| `labels` | `Partial<CalendarFeedLabels>` | — | All copy, including both confirms. |

## Accessibility

- State is the word On or Off.
- Reset and revoke are confirm dialogs with focus trapped.

## Don't

- No token in shared props. Flash only.
- No amounts, notes or contact details in the feed. The URL leaks to calendar providers.

## FAQ

**Why ask for a password to create?**

The link is the credential: anyone with it reads your calendar. Same rule as other secrets.
