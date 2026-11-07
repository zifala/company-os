import type { DocEntry } from '../types';

export const notificationBell: DocEntry = {
    slug: 'notification-bell',
    name: 'NotificationBell',
    category: 'shell',
    pieces: [10],
    tagline: 'The header bell. A count badge, then a Sheet with the work waiting for you and the recent activity.',
    job: 'Tell one person what needs them now and what just happened.',
    tags: ['notifications', 'bell', 'inbox', 'sheet', 'badge', 'attention'],
    exports: ['NotificationBell', 'NotificationList', 'notificationLabels', 'NotificationData', 'NotificationLabels', 'WaitingItem', 'RecentItem'],
    files: ['components/company-os/notification-bell.tsx', 'components/company-os/notification-list.tsx'],
    shadcnDeps: ['button', 'sheet'],
    intro: [
        'An icon button with the unread count (<b>9+</b> past nine). Opening it calls <code>onOpen()</code> and renders the result in a right-hand Sheet with two sections. <b>Needs your attention</b>: queues of work with a count and a link to the filtered list ("Invoices to approve · 2"). <b>Recent</b>: the last notifications, unread in ink, read in grey, each with its time label.',
        'The bell never fetches or subscribes. The page passes the count from shared props and <code>onOpen</code> as a request; live updates (Echo, polling) reload the count outside the component. "Mark all read" and "View all notifications" are plain links to the routes you pass.',
    ],
    examples: [
        {
            title: 'Bell with waiting work',
            description: 'The demo resolves two queues and three recent rows after 300 ms.',
            demoKey: 'notification-bell',
            code: `import { NotificationBell } from '@/components/company-os';
import { router, usePage } from '@inertiajs/react';
import notifications from '@/routes/notifications';

const { unreadNotifications } = usePage().props;

const loadBell = () =>
  fetch(notifications.index.url(), { headers: { Accept: 'application/json' } })
    .then((response) => response.json());

useEchoNotification(\`App.Models.User.\${auth.user.id}\`, () =>
  router.reload({ only: ['unreadNotifications'] }),
);

<NotificationBell
  count={unreadNotifications}
  onOpen={loadBell}
  markAllHref={notifications.read()}
  historyHref={notifications.history()}
/>`,
        },
    ],
    props: [
        {
            component: 'NotificationBell',
            rows: [
                { name: 'count', type: 'number', description: 'Unread count from shared props. 0 hides the badge.' },
                { name: 'onOpen', type: '() => Promise<NotificationData>', description: 'Called on every open. Resolves <code>{ waiting: { key, label, count, href }[], recent: { id, message, url, read, at_label }[] }</code>.' },
                { name: 'markAllHref', type: 'Href', description: 'Shown in the header while <code>count &gt; 0</code>.' },
                { name: 'historyHref', type: 'Href', description: 'Footer link to the full history page.' },
                { name: 'labels', type: 'Partial<NotificationLabels>', description: 'title, waiting, recent, nothingWaiting, noRecent, loading, failed, markAll, history.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Enter / Space', action: 'Open the sheet from the focused bell.' },
            { keys: 'Tab', action: 'Move through queue links, recent links and the footer.' },
            { keys: 'Esc', action: 'Close.' },
        ],
        notes: [
            'The icon button carries <code>aria-label</code> from <code>labels.title</code>; the badge is text, so the count is read.',
            'Unread is a colour and the read flag; the server marks items read when opened, so the state does not depend on the colour.',
            'Rows without a URL render as text, not as dead links.',
        ],
    },
    donts: [
        'No dropdown. Work waiting needs room; the bell opens a Sheet.',
        'No fetch, no Echo inside. Count and list come from the page.',
        'No toast per notification. The badge and the sheet are the channel; desktop alerts only for reminders.',
        'No unread count computed in React. The server shares it.',
    ],
    faq: [
        { q: 'What goes in "Needs your attention"?', a: 'Queues the user can act on: approvals, reviews, assignments due. Each row links to the filtered index. Empty reads "Nothing is waiting for you."' },
        { q: 'How does a click mark it read?', a: 'Point each <code>url</code> at the <code>notifications.open</code> route; it marks read and redirects to the stored URL.' },
    ],
};
