import type { DocEntry } from '../types';

export const calendarFeedCard: DocEntry = {
    slug: 'calendar-feed-card',
    name: 'CalendarFeedCard',
    category: 'organization',
    pieces: [12],
    tagline: 'The personal ICS link: off or on, create, the new URL shown once, reset and revoke behind a confirm.',
    job: 'Let each person put their own events, reminders and due dates in the calendar app they already use.',
    tags: ['calendar', 'ics', 'feed', 'subscribe', 'settings', 'token'],
    exports: ['CalendarFeedCard', 'calendarFeedLabels', 'CalendarFeedLabels'],
    files: ['components/company-os/calendar-feed-card.tsx'],
    registryDeps: ['confirm-dialog', 'secret-reveal'],
    shadcnDeps: ['button'],
    intro: [
        'Lives on <code>Settings/notifications</code>. Create posts to <code>calendar-feed.store</code> behind password confirm; the controller flashes <code>calendarFeedUrl</code> and the card shows it once in a SecretReveal. Only the sha256 of the token is stored.',
        'Reset is create again — the old link 404s at once — so it asks first. Revoke deletes the hash and asks first too.',
    ],
    examples: [
        {
            title: 'In personal settings',
            demoKey: 'calendar-feed-card-basic',
            code: `import { CalendarFeedCard } from '@/components/company-os';

<CalendarFeedCard
  active={calendarFeed.active}
  url={flash.calendarFeedUrl ?? null}
  processing={processing}
  onCreate={() => router.post(route('calendar-feed.store'))}
  onRevoke={() => router.delete(route('calendar-feed.destroy'))}
/>`,
        },
    ],
    props: [
        {
            component: 'CalendarFeedCard',
            rows: [
                { name: 'active', type: 'boolean', description: 'A hash exists for this user.' },
                { name: 'url', type: 'string | null', description: 'The flashed URL, only on the response after create.' },
                { name: 'processing', type: 'boolean', defaultValue: 'false', description: 'Disables the buttons.' },
                { name: 'onCreate', type: '() => void', description: 'Create and reset both call it.' },
                { name: 'onRevoke', type: '() => void', description: 'After the confirm.' },
                { name: 'labels', type: 'Partial<CalendarFeedLabels>', description: 'All copy, including both confirms.' },
            ],
        },
    ],
    a11y: { notes: ['State is the word On or Off.', 'Reset and revoke are confirm dialogs with focus trapped.'] },
    donts: ['No token in shared props. Flash only.', 'No amounts, notes or contact details in the feed. The URL leaks to calendar providers.'],
    faq: [{ q: 'Why ask for a password to create?', a: 'The link is the credential: anyone with it reads your calendar. Same rule as other secrets.' }],
};
