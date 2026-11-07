import type { DocEntry } from '../types';

export const appShell: DocEntry = {
    slug: 'app-shell',
    name: 'AppShell',
    category: 'shell',
    pieces: [19],
    tagline: 'Sidebar left, thin header, content below. The one layout every signed-in page renders in.',
    job: 'Hold the sidebar, the header and the page in the one frame the product has.',
    tags: ['shell', 'layout', 'sidebar', 'header', 'frame'],
    exports: ['AppShell'],
    files: ['components/company-os/app-shell.tsx'],
    registryDeps: ['app-sidebar', 'app-header'],
    shadcnDeps: ['sidebar'],
    intro: [
        '<code>SidebarProvider</code> around a <code>sidebar</code> slot and a <code>SidebarInset</code> that stacks the <code>header</code> over the page body (<code>gap-6 p-4 md:p-6</code>). <code>defaultOpen</code> comes from the <code>sidebar_state</code> cookie the server shares, so the sidebar does not flash open on every load.',
        'One shell, not two. Delete the starter kit\'s header-only layout. Nothing sits above the page title: no breadcrumbs, no page name in the header. The sidebar says where you are.',
    ],
    examples: [
        {
            title: 'The full shell',
            description: 'Sidebar with New and the user menu, header with search · locale · bell, a page with its header and stat row.',
            demoKey: 'app-shell',
            code: `import { AppHeader, AppShell, AppSidebar, AppLogo, LocaleSwitch, NavUser, NotificationBell, QuickCreate, SearchButton } from '@/components/company-os';

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth, sidebarOpen, favorites, unreadNotifications } = usePage().props;

  return (
    <AppShell
      defaultOpen={sidebarOpen}
      sidebar={
        <AppSidebar
          logo={<AppLogo icon={<Logo />} name={props.name} />}
          homeHref={dashboard()}
          groups={navGroups}
          permissions={auth.permissions}
          favorites={favorites}
          create={<QuickCreate items={createItems} />}
          footer={<NavUser user={auth.user} items={userMenu} logout={{ label: t('Log out'), href: logout(), icon: LogOut }} />}
        />
      }
      header={
        <AppHeader>
          <SearchButton onClick={() => setPalette(true)} />
          <LocaleSwitch locales={locales} current={locale} onChange={switchLocale} />
          <NotificationBell count={unreadNotifications} onOpen={loadBell} historyHref={notifications.history()} />
        </AppHeader>
      }
    >
      {children}
      <ShortcutHost />
      <AppTour … />
    </AppShell>
  );
}`,
        },
    ],
    props: [
        {
            component: 'AppShell',
            rows: [
                { name: 'sidebar', type: 'ReactNode', description: 'An <code>AppSidebar</code>.' },
                { name: 'header', type: 'ReactNode', description: 'An <code>AppHeader</code> with its right-side controls.' },
                { name: 'children', type: 'ReactNode', description: 'The page.' },
                { name: 'defaultOpen', type: 'boolean', defaultValue: 'true', description: 'Sidebar state from the shared cookie prop.' },
                { name: 'className', type: 'string', description: 'On the provider. Demos pass <code>min-h-0 h-full</code> to fit a frame.' },
            ],
        },
    ],
    a11y: {
        keyboard: [
            { keys: '⌘B / Ctrl+B', action: 'Toggle the sidebar (ui Sidebar default).' },
        ],
        notes: [
            'The header is a <code>&lt;header&gt;</code>, the sidebar a <code>&lt;nav&gt;</code>-bearing aside, the page a <code>&lt;main&gt;</code> from <code>SidebarInset</code>.',
            'Below <code>md</code> the sidebar becomes a Sheet opened by the header trigger.',
        ],
    },
    donts: [
        'No breadcrumbs, no page title in the header.',
        'No create button in the header. "New" sits under the logo; the page header owns "+ Create".',
        'No second layout for "simple" pages. Auth pages have their own; everything signed-in is this.',
    ],
    faq: [
        { q: 'Where do the palette, the shortcut sheet and the tour mount?', a: 'As children of the shell in the layout, once. They render nothing visible until opened.' },
        { q: 'Scoped workspace (department, project)?', a: 'Swap the <code>sidebar</code> slot for the workspace sidebar when the page carries that scope. Same shell.' },
    ],
};
