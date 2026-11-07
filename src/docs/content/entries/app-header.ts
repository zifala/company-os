import type { DocEntry } from '../types';

export const appHeader: DocEntry = {
    slug: 'app-header',
    name: 'AppHeader',
    category: 'shell',
    pieces: [19],
    tagline: 'A thin bar: sidebar trigger left, then trigger · search · locale · bell. Nothing else.',
    job: 'Hold the three global controls without stealing the page title.',
    tags: ['header', 'search', 'bell', 'locale', 'trigger'],
    exports: ['AppHeader', 'SearchButton'],
    files: ['components/company-os/app-header.tsx'],
    shadcnDeps: ['button', 'kbd', 'sidebar'],
    intro: [
        '64px tall, 48px when the sidebar is collapsed, a faint bottom border. The <code>SidebarTrigger</code> sits left; children align right in this order: <b>SearchButton</b>, <b>LocaleSwitch</b>, <b>NotificationBell</b>. <code>SearchButton</code> is the outlined "Search ⌘K" field-lookalike that opens the palette; it carries <code>data-tour="search"</code>.',
        'No page title, no breadcrumbs, no create button, no theme toggle. The page header below owns the title and its actions.',
    ],
    examples: [
        {
            title: 'Search · locale · bell',
            demoKey: 'app-header',
            code: `import { AppHeader, LocaleSwitch, NotificationBell, SearchButton } from '@/components/company-os';

<AppHeader>
  <SearchButton onClick={() => setPalette(true)} label={t('Search')} />
  <LocaleSwitch locales={locales} current={locale} onChange={(value) => router.post(localeRoute.update(), { locale: value })} />
  <NotificationBell count={unreadNotifications} onOpen={loadBell} historyHref={notifications.history()} />
</AppHeader>`,
        },
    ],
    props: [
        {
            component: 'AppHeader',
            rows: [{ name: 'children', type: 'ReactNode', description: 'Right-aligned controls, in the order search · locale · bell.' }],
        },
        {
            component: 'SearchButton',
            rows: [
                { name: 'onClick', type: '() => void', description: 'Opens the palette.' },
                { name: 'label', type: 'string', defaultValue: "'Search'", description: 'Button text.' },
                { name: 'shortcut', type: 'string', defaultValue: "'⌘K'", description: 'Shown as a Kbd on the right.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: 'Tab', action: 'Trigger, search, locale, bell.' },
            { keys: '⌘B', action: 'Toggle the sidebar.' },
        ],
        notes: [
            'A landmark <code>&lt;header&gt;</code>. The trigger has its own screen-reader label from the ui Sidebar.',
            'SearchButton is a real button; the Kbd is decorative text.',
        ],
    },
    donts: [
        'No page title or breadcrumbs here.',
        'No create button. New lives in the sidebar, Create in the page header.',
        'No fourth control. If a product needs one, it goes in the user menu.',
    ],
    faq: [
        { q: 'Mobile?', a: 'The trigger opens the sidebar as a sheet; the search button shrinks with the row. The bell stays.' },
    ],
};
