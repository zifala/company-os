# NotificationBell · Company OS

The header bell. A count badge, then a Sheet with the work waiting for you and the recent activity.

**One job:** Tell one person what needs them now and what just happened.
**Category:** shell · **Pieces:** 10 · **Exports:** NotificationBell, NotificationList, notificationLabels, NotificationData, NotificationLabels, WaitingItem, RecentItem · **Tags:** notifications, bell, inbox, sheet, badge, attention

## Installation

```bash
npx shadcn@latest add http://localhost:5173/r/notification-bell.json
```

Manual: copy components/company-os/notification-bell.tsx, components/company-os/notification-list.tsx into your project (plus lib/navigation.tsx and the token set).
shadcn primitives: button, sheet.

## Overview

An icon button with the unread count (**9+** past nine). Opening it calls `onOpen()` and renders the result in a right-hand Sheet with two sections. **Needs your attention**: queues of work with a count and a link to the filtered list ("Invoices to approve · 2"). **Recent**: the last notifications, unread in ink, read in grey, each with its time label.

The bell never fetches or subscribes. The page passes the count from shared props and `onOpen` as a request; live updates (Echo, polling) reload the count outside the component. "Mark all read" and "View all notifications" are plain links to the routes you pass.

## Examples

### Bell with waiting work

The demo resolves two queues and three recent rows after 300 ms.

```tsx
import { NotificationBell } from '@/components/company-os';
import { router, usePage } from '@inertiajs/react';
import notifications from '@/routes/notifications';

const { unreadNotifications } = usePage().props;

const loadBell = () =>
  fetch(notifications.index.url(), { headers: { Accept: 'application/json' } })
    .then((response) => response.json());

useEchoNotification(`App.Models.User.${auth.user.id}`, () =>
  router.reload({ only: ['unreadNotifications'] }),
);

<NotificationBell
  count={unreadNotifications}
  onOpen={loadBell}
  markAllHref={notifications.read()}
  historyHref={notifications.history()}
/>
```

## Props

### NotificationBell

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | — | Unread count from shared props. 0 hides the badge. |
| `onOpen` | `() => Promise<NotificationData>` | — | Called on every open. Resolves `{ waiting: { key, label, count, href }[], recent: { id, message, url, read, at_label }[] }`. |
| `markAllHref` | `Href` | — | Shown in the header while `count > 0`. |
| `historyHref` | `Href` | — | Footer link to the full history page. |
| `labels` | `Partial<NotificationLabels>` | — | title, waiting, recent, nothingWaiting, noRecent, loading, failed, markAll, history. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter / Space | Open the sheet from the focused bell. |
| Tab | Move through queue links, recent links and the footer. |
| Esc | Close. |

- The icon button carries `aria-label` from `labels.title`; the badge is text, so the count is read.
- Unread is a colour and the read flag; the server marks items read when opened, so the state does not depend on the colour.
- Rows without a URL render as text, not as dead links.

## Don't

- No dropdown. Work waiting needs room; the bell opens a Sheet.
- No fetch, no Echo inside. Count and list come from the page.
- No toast per notification. The badge and the sheet are the channel; desktop alerts only for reminders.
- No unread count computed in React. The server shares it.

## FAQ

**What goes in "Needs your attention"?**

Queues the user can act on: approvals, reviews, assignments due. Each row links to the filtered index. Empty reads "Nothing is waiting for you."

**How does a click mark it read?**

Point each `url` at the `notifications.open` route; it marks read and redirects to the stored URL.
